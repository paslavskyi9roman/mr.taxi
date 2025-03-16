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
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserRole } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  public logIn(email: string, password: string, rememberMe: boolean): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        if (rememberMe) {
          this.auth.setPersistence(browserLocalPersistence);
        } else {
          this.auth.setPersistence(browserSessionPersistence);
        }
        return from(Promise.resolve(userCredential));
      })
    );
  }

  public signUp(
    email: string,
    password: string,
    name: string,
    phoneNumber: string
  ): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        return from(updateProfile(userCredential.user, { displayName: name })).pipe(
          switchMap(() => {
            const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
            return from(
              setDoc(userDocRef, {
                role: UserRole.User,
                name: name,
                phoneNumber: phoneNumber,
                email: email
              })
            ).pipe(map(() => userCredential));
          })
        );
      })
    );
  }

  public signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((userCredential) => {
        const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        return from(
          setDoc(
            userDocRef,
            {
              role: UserRole.User,
              name: userCredential.user.displayName,
              email: userCredential.user.email,
              phoneNumber: userCredential.user.phoneNumber
            },
            { merge: true }
          )
        ).pipe(map(() => userCredential));
      })
    );
  }

  public signInWithApple(): Observable<UserCredential> {
    const provider = new OAuthProvider('apple.com');
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((userCredential) => {
        const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        return from(
          setDoc(
            userDocRef,
            {
              role: UserRole.User,
              name: userCredential.user.displayName,
              email: userCredential.user.email,
              phoneNumber: userCredential.user.phoneNumber
            },
            { merge: true }
          )
        ).pipe(map(() => userCredential));
      })
    );
  }

  public logOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  public authState(): Observable<any> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  public forgotPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }
}
