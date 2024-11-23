import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';

@Component({
  selector: 'app-taxi-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, MtButtonComponent],
  templateUrl: './taxi-order-form.component.html',
  styleUrls: ['./taxi-order-form.component.scss']
})
export class TaxiOrderFormComponent {
  public taxiOrderForm: FormGroup;
  public showAdditionalStops: boolean = false;

  private readonly formBuilder: FormBuilder;

  constructor(formBuilder: FormBuilder) {
    this.formBuilder = formBuilder;
    this.taxiOrderForm = this.formBuilder.group({
      from: ['', Validators.required],
      additionalStops: [''],
      to: ['', Validators.required],
      passengerName: ['', Validators.required],
      numberOfPassengers: [1, Validators.required],
      passengerPhoneNumber: ['', Validators.required],
      comment: ['']
    });
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
}
