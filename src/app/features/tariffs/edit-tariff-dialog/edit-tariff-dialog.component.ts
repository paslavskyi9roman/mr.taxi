import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MtButtonComponent } from '../../../shared/components/mt-button/mt-button.component';
import { Tariff } from '../tariff.model';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

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
    TranslatePipe,
    MatIcon
  ],
  styleUrls: ['./edit-tariff-dialog.component.scss']
})
export class EditTariffDialogComponent {
  public form: FormGroup;
  public additionalStops: FormArray;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTariffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tariff
  ) {
    this.form = this.fb.group({
      from: [data.route.from, Validators.required],
      to: [data.route.to, Validators.required],
      price: [data.price, Validators.required],
      additionalStops: this.fb.array(data.additionalStops.map((stop) => this.fb.control(stop.from)))
    });
    this.additionalStops = this.form.get('additionalStops') as FormArray;
  }

  public save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const updatedTariff: Tariff = {
        ...this.data,
        price: formValue.price,
        route: { from: formValue.from, to: formValue.to },
        additionalStops: formValue.additionalStops.map((stop: string) => ({ from: stop, to: stop }))
      };
      this.dialogRef.close(updatedTariff);
    }
  }

  public addStop(): void {
    this.additionalStops.push(this.fb.control(''));
  }

  public removeStop(index: number): void {
    this.additionalStops.removeAt(index);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
