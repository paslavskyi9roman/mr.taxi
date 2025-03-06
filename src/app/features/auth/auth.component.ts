import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe, MtButtonComponent],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public signInForm: FormGroup;
  public logInForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
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
      console.log('Sign-In Form Data:', this.signInForm.value);
    }
  }

  public onLogIn(): void {
    if (this.logInForm.valid) {
      console.log('Log-In Form Data:', this.logInForm.value);
    }
  }
}
