import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { MtModalComponent } from '../../shared/components/mt-modal/mt-modal.component';
import { AdditionalInfoFormComponent } from '../additional-info-form/additional-info-form.component';
import { TaxiOrderService } from '../../core/services/taxi-order.service';

@Component({
  selector: 'app-taxi-order-form',
  imports: [
    ReactiveFormsModule,
    MtButtonComponent,
    TranslatePipe,
    MtModalComponent,
    AdditionalInfoFormComponent
  ],
  templateUrl: './taxi-order-form.component.html',
  styleUrls: ['./taxi-order-form.component.scss']
})
export class TaxiOrderFormComponent {
  public taxiOrderForm: FormGroup;
  public additionalStops: FormArray;
  public isModalOpen = false;

  private taxiOrderService = inject(TaxiOrderService);
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
      comment: [''],
      luggage: [''],
      rideDate: [''],
      rideTime: [''],
      flightNumber: ['']
    });
    this.additionalStops = this.taxiOrderForm.get('additionalStops') as FormArray;
  }

  public onSubmit(): void {
    if (this.taxiOrderForm.valid) {
      this.taxiOrderService.bookATaxi(this.taxiOrderForm.value);
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
    if (this.additionalStops.length < 3) {
      this.additionalStops.push(this.formBuilder.control(''));
    }
  }

  public removeStop(index: number): void {
    this.additionalStops.removeAt(index);
  }

  public openModal(): void {
    this.isModalOpen = true;
  }

  public handleConfirm(additionalInfoFormData: any): void {
    this.taxiOrderForm.patchValue({
      luggage: additionalInfoFormData.luggage,
      rideDate: additionalInfoFormData.rideDate,
      rideTime: additionalInfoFormData.rideTime,
      flightNumber: additionalInfoFormData.flightNumber
    });

    this.isModalOpen = false;
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }
}
