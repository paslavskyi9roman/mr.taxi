import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-taxi-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, MtButtonComponent, TranslatePipe],
  templateUrl: './taxi-order-form.component.html',
  styleUrls: ['./taxi-order-form.component.scss']
})
export class TaxiOrderFormComponent {
  public taxiOrderForm: FormGroup;
  public showAdditionalStops: boolean = false;
  public additionalStops: FormArray;

  private readonly formBuilder: FormBuilder;

  constructor(formBuilder: FormBuilder) {
    this.formBuilder = formBuilder;
    this.taxiOrderForm = this.formBuilder.group({
      from: ['', Validators.required],
      additionalStops: this.formBuilder.array([]),
      to: ['', Validators.required],
      passengerName: ['', Validators.required],
      numberOfPassengers: [1, Validators.required],
      passengerPhoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      comment: ['']
    });
    this.additionalStops = this.taxiOrderForm.get('additionalStops') as FormArray;
  }

  public onSubmit(): void {
    if (this.taxiOrderForm.valid) {
      console.log(this.taxiOrderForm.value);
    }
  }

  public increasePassengers(): void {
    const currentValue = this.taxiOrderForm.get('numberOfPassengers')?.value;
    this.taxiOrderForm.get('numberOfPassengers')?.setValue(currentValue + 1);
  }

  public decreasePassengers(): void {
    const currentValue = this.taxiOrderForm.get('numberOfPassengers')?.value;
    if (currentValue > 1) {
      this.taxiOrderForm.get('numberOfPassengers')?.setValue(currentValue - 1);
    }
  }

  public addStop(): void {
    this.additionalStops.push(this.formBuilder.control(''));
  }

  public removeStop(index: number): void {
    this.additionalStops.removeAt(index);
  }
}
