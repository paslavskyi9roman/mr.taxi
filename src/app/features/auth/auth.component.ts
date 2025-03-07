import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe, MtButtonComponent],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public signInForm: FormGroup;
  public logInForm: FormGroup;
  public signInError: string | null = null;
  public logInError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.logInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  public onSignIn(): void {
    if (this.signInForm.valid) {
      this.authService
        .signIn(this.signInForm.value.email, this.signInForm.value.password)
        .subscribe({
          next: (result) => {
            this.router.navigate(['/']);
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
      this.authService.signIn(this.logInForm.value.email, this.logInForm.value.password).subscribe({
        next: (result) => {
          this.router.navigate(['/']);
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
        this.router.navigate(['/']);
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
        this.router.navigate(['/']);
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
        this.router.navigate(['/']);
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
        this.router.navigate(['/']);
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
}
