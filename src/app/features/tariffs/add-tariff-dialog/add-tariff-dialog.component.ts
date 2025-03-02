import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MtButtonComponent } from '../../../shared/components/mt-button/mt-button.component';
import { Tariff } from '../mock-tariffs';

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
    MtButtonComponent
  ],
  styleUrls: ['./add-tariff-dialog.component.scss']
})
export class AddTariffDialogComponent {
  public form: FormGroup;

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

  public save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const tariff: Tariff = {
        price: formValue.price,
        route: {
          from: formValue.from,
          to: formValue.to
        },
        additionalStops: []
      };
      this.dialogRef.close(tariff);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
