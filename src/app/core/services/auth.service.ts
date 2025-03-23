import { Injectable } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRole } from '../models/user.enum';
import { AuthenticationService } from './authentication.service';
import { UserRoleService } from './user-role.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userRole$: Observable<UserRole | null>;

  constructor(
    private authenticationService: AuthenticationService,
    private userRoleService: UserRoleService
  ) {
    this.userRole$ = this.userRoleService.userRole$;
  }

  public logIn(email: string, password: string, rememberMe: boolean): Observable<UserCredential> {
    return this.authenticationService.logIn(email, password, rememberMe);
  }

  public signUp(
    email: string,
    password: string,
    name: string,
    phoneNumber: string
  ): Observable<UserCredential> {
    return this.authenticationService.signUp(email, password, name);
  }

  public signInWithGoogle(): Observable<UserCredential> {
    return this.authenticationService.signInWithGoogle();
  }

  public signInWithApple(): Observable<UserCredential> {
    return this.authenticationService.signInWithApple();
  }

  public logOut(): Observable<void> {
    return this.authenticationService.logOut();
  }

  public authState(): Observable<any> {
    return this.authenticationService.authState();
  }

  public forgotPassword(email: string): Observable<void> {
    return this.authenticationService.forgotPassword(email);
  }
}
