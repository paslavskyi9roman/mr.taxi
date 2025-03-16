import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { MtModalComponent } from '../../shared/components/mt-modal/mt-modal.component';
import { AdditionalInfoFormComponent } from '../additional-info-form/additional-info-form.component';
import { TaxiOrderService } from '../../core/services/taxi-order.service';
import { TariffService } from '../tariffs/tariff.service';
import { startWith, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AdditionalInfo } from '../../core/models/additional-info.model';

@Component({
  selector: 'app-taxi-order-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MtButtonComponent,
    TranslatePipe,
    MtModalComponent,
    AdditionalInfoFormComponent,
    CommonModule
  ],
  templateUrl: './taxi-order-form.component.html',
  styleUrls: ['./taxi-order-form.component.scss']
})
export class TaxiOrderFormComponent implements OnInit {
  public taxiOrderForm: FormGroup;
  public additionalStops: FormArray;
  public isModalOpen = false;
  public cityControl = new FormControl();
  public filteredCities: string[] = [];

  private taxiOrderService = inject(TaxiOrderService);
  private tariffService = inject(TariffService);
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

  ngOnInit(): void {
    this.initializeCityFilter();
  }

  private initializeCityFilter(): void {
    this.tariffService.getCities().subscribe((cities) => {
      this.filteredCities = cities || [];
      this.cityControl.valueChanges
        .pipe(
          startWith(''),
          map((value) => this.filterCities(value))
        )
        .subscribe((filtered) => (this.filteredCities = filtered));
    });
  }

  private filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredCities.filter((city) => city.toLowerCase().includes(filterValue));
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

  public handleConfirm(additionalInfoFormData: AdditionalInfo): void {
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
