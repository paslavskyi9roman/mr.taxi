import { Component } from '@angular/core';
import {MatDialogActions, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MtButtonComponent} from '../../../shared/components/mt-button/mt-button.component';

@Component({
  selector: 'app-add-tariff-dialog',
  templateUrl: './add-tariff-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogActions,
    MtButtonComponent
  ],
  styleUrls: ['./add-tariff-dialog.component.scss']
})
export class AddTariffDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTariffDialogComponent>
  ) {
    this.form = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
