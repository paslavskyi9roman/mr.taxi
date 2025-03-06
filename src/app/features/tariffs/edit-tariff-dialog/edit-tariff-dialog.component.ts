import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MtButtonComponent } from '../../../shared/components/mt-button/mt-button.component';
import { Tariff } from '../tariff.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-tariff-dialog',
  templateUrl: './edit-tariff-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MtButtonComponent,
    TranslatePipe
  ],
  styleUrls: ['./edit-tariff-dialog.component.scss']
})
export class EditTariffDialogComponent {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTariffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tariff
  ) {
    this.form = this.fb.group({
      from: [data.route.from, Validators.required],
      to: [data.route.to, Validators.required],
      price: [data.price, Validators.required]
    });
  }

  public save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const updatedTariff: Tariff = {
        ...this.data,
        price: formValue.price,
        route: { from: formValue.from, to: formValue.to }
      };
      this.dialogRef.close(updatedTariff);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
