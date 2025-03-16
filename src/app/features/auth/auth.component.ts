import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { TranslatePipe } from '@ngx-translate/core';

import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { AuthService } from '../../core/services/auth.service';
import { MatRadioButton } from '@angular/material/radio';
import { MtLinkButtonComponent } from '../../shared/components/mt-link-button/mt-link-button.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe,
    MtButtonComponent,
    MatRadioButton,
    MtLinkButtonComponent
  ],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  onForgotPassword() {
    throw new Error('Method not implemented.');
  }
  public signInForm: FormGroup;
  public logInForm: FormGroup;
  public signInError: string | null = null;
  public logInError: string | null = null;
  public isLoginMode = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
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
      this.authService
        .signUp(
          this.signInForm.value.email,
          this.signInForm.value.password,
          this.signInForm.value.name,
          this.signInForm.value.phoneNumber
        )
        .subscribe({
          next: (userCredential) => {
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Sign-In Error', error);
            this.signInError = this.getErrorMessage(error.code);
          }
        });
    }
  }

  public onLogIn(): void {
    if (this.logInForm.valid) {
      const { email, password, rememberMe } = this.logInForm.value;
      this.authService.logIn(email, password, rememberMe).subscribe({
        next: (result) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.logInError = this.getErrorMessage(error.code);
        }
      });
    }
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

  public onSignInWithGoogle(): void {
    this.authService.signInWithGoogle().subscribe({
      next: (result) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Sign-In with Google Error', error);
        this.signInError = this.getErrorMessage(error.code);
      }
    });
  }

  public onSignInWithApple(): void {
    this.authService.signInWithApple().subscribe({
      next: (result) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Sign-In with Apple Error', error);
        this.signInError = this.getErrorMessage(error.code);
      }
    });
  }

  public onLogInWithGoogle(): void {
    this.authService.signInWithGoogle().subscribe({
      next: (result) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Log-In with Google Error', error);
        this.logInError = this.getErrorMessage(error.code);
      }
    });
  }

  public onLogInWithApple(): void {
    this.authService.signInWithApple().subscribe({
      next: (result) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Log-In with Apple Error', error);
        this.logInError = this.getErrorMessage(error.code);
      }
    });
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
}
