import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  UserCredential,
  updateProfile,
  sendPasswordResetEmail,
  User
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PersistenceService } from './persistence.service';
import { UserRoleService } from './user-role.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private auth: Auth,
    private persistenceService: PersistenceService,
    private userRoleService: UserRoleService
  ) {}

  public logIn(email: string, password: string, rememberMe: boolean): Observable<UserCredential> {
    return from(this.persistenceService.setPersistence(rememberMe)).pipe(
      switchMap(() => signInWithEmailAndPassword(this.auth, email, password)),
      tap((credential) => this.userRoleService.getUserRole(credential.user.uid))
    );
  }

  public signUp(email: string, password: string, name: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) =>
        from(updateProfile(userCredential.user, { displayName: name })).pipe(
          switchMap(() => this.userRoleService.getUserRole(userCredential.user.uid)),
          switchMap((role) => {
            if (!role) {
              return this.userRoleService.setUserRole(userCredential.user.uid);
            }
            return Promise.resolve();
          }),
          switchMap(() => Promise.resolve(userCredential))
        )
      )
    );
  }

  public signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    return this.signInWithProvider(provider);
  }

  public signInWithApple(): Observable<UserCredential> {
    const provider = new OAuthProvider('apple.com');
    return this.signInWithProvider(provider);
  }

  private signInWithProvider(
    provider: GoogleAuthProvider | OAuthProvider
  ): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((credential) =>
        from(this.userRoleService.getUserRole(credential.user.uid)).pipe(
          switchMap((role) => {
            if (!role) {
              return this.userRoleService.setUserRole(credential.user.uid);
            }
            return Promise.resolve();
          }),
          switchMap(() => Promise.resolve(credential))
        )
      )
    );
  }

  public logOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(tap(() => this.userRoleService.clearUserRole()));
  }

  public authState(): Observable<User | null> {
    return new Observable((observer) => {
      return onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.userRoleService.getUserRole(user.uid);
        } else {
          this.userRoleService.clearUserRole();
        }
        observer.next(user);
      });
    });
  }

  public forgotPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }
}
