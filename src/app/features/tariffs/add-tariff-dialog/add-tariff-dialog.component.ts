import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

import { Tariff } from '../tariff.model';
import { MtButtonComponent } from '../../../shared/components/mt-button/mt-button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-tariff-dialog',
  templateUrl: './add-tariff-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, MtButtonComponent, TranslatePipe],
  styleUrls: ['./add-tariff-dialog.component.scss']
})
export class AddTariffDialogComponent {
  public form: FormGroup;
  public additionalStops: FormArray;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTariffDialogComponent>
  ) {
    this.form = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      price: ['', Validators.required],
      additionalStops: this.fb.array([])
    });
    this.additionalStops = this.form.get('additionalStops') as FormArray;
  }

  public save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const tariff: Partial<Tariff> = {
        price: formValue.price,
        route: { from: formValue.from, to: formValue.to },
        additionalStops: formValue.additionalStops.map((stop: string) => ({ from: stop, to: stop }))
      };
      this.dialogRef.close(tariff);
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
