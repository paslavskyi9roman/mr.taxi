import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Tariff } from '../tariff.model';
import { MtButtonComponent } from '../../../shared/components/mt-button/mt-button.component';

@Component({
  selector: 'app-add-tariff-dialog',
  templateUrl: './add-tariff-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, MtButtonComponent],
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
        route: { from: formValue.from, to: formValue.to },
        additionalStops: []
      };
      this.dialogRef.close(tariff);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
