import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { AuthService } from '../../core/services/auth.service';
import { MtLinkButtonComponent } from '../../shared/components/mt-link-button/mt-link-button.component';

type AuthProvider = 'google' | 'apple';
type AuthMode = 'signIn' | 'logIn';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe,
    MtButtonComponent,
    MtLinkButtonComponent
  ],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public signInForm: FormGroup;
  public logInForm: FormGroup;
  public signInError: string | null = null;
  public logInError: string | null = null;
  public isLoginMode = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.signInForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.logInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  public onSignUp(): void {
    if (this.signInForm.valid) {
      const { email, password, name, phoneNumber } = this.signInForm.value;
      this.authService
        .signUp(email, password, name, phoneNumber)
        .subscribe(this.createAuthObserver('signIn'));
    }
  }

  public onLogIn(): void {
    if (this.logInForm.valid) {
      const { email, password, rememberMe } = this.logInForm.value;
      this.authService
        .logIn(email, password, rememberMe)
        .subscribe(this.createAuthObserver('logIn'));
    }
  }

  public authenticateWithProvider(provider: AuthProvider, mode: AuthMode): void {
    const method = provider === 'google' ? 'signInWithGoogle' : 'signInWithApple';

    this.authService[method]().subscribe(
      this.createAuthObserver(
        mode,
        `${mode} with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
      )
    );
  }

  public onSignInWithGoogle(): void {
    this.authenticateWithProvider('google', 'signIn');
  }

  public onSignInWithApple(): void {
    this.authenticateWithProvider('apple', 'signIn');
  }

  public onLogInWithGoogle(): void {
    this.authenticateWithProvider('google', 'logIn');
  }

  public onLogInWithApple(): void {
    this.authenticateWithProvider('apple', 'logIn');
  }

  private createAuthObserver(mode: AuthMode, operationName: string = mode) {
    const errorProperty = mode === 'signIn' ? 'signInError' : 'logInError';

    return {
      next: () => this.navigateToHome(),
      error: (error: any) => {
        console.error(`${operationName} Error`, error);
        this[errorProperty] = this.getErrorMessage(error.code);
      }
    };
  }

  private navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later or reset your password.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  public clearSignInError(): void {
    this.signInError = null;
  }

  public clearLogInError(): void {
    this.logInError = null;
  }

  public toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  public onForgotPassword(): void {
    const email = this.logInForm.value.email;
    if (email) {
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.showSnackBar('AUTH.PASSWORD_RESET_EMAIL_SENT');
        },
        error: (error) => {
          console.error('Forgot Password Error', error);
          this.showSnackBar('AUTH.PASSWORD_RESET_EMAIL_ERROR');
        }
      });
    } else {
      this.showSnackBar('AUTH.ENTER_EMAIL_ADDRESS');
    }
  }

  private showSnackBar(messageKey: string): void {
    this.snackBar.open(this.translate.instant(messageKey), '', {
      duration: 5000
    });
  }
}
