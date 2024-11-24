import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { CommonModule } from '@angular/common';
import { MtSlideToggleComponent } from '../../shared/components/mt-slide-toggle/mt-slide-toggle.component';

@Component({
  selector: 'app-additional-info-form',
  standalone: true,
  imports: [ReactiveFormsModule, MtButtonComponent, CommonModule, MtSlideToggleComponent],
  templateUrl: './additional-info-form.component.html',
  styleUrls: ['./additional-info-form.component.scss']
})
export class AdditionalInfoFormComponent {
  public additionalInfoForm: FormGroup;
  @Output() public formSubmitted = new EventEmitter<any>();

  public showLuggage = false;
  public showScheduledRide = false;
  public showFlightNumber = false;

  constructor(private formBuilder: FormBuilder) {
    this.additionalInfoForm = this.formBuilder.group({
      luggage: [''],
      scheduledRide: [''],
      flightNumber: ['']
    });
  }

  public toggleLuggage(checked: boolean): void {
    this.showLuggage = checked;
    if (!checked) {
      this.additionalInfoForm.get('luggage')?.reset();
    }
  }

  public toggleScheduledRide(checked: boolean): void {
    this.showScheduledRide = checked;
    if (!checked) {
      this.additionalInfoForm.get('scheduledRide')?.reset();
    }
  }

  public toggleFlightNumber(checked: boolean): void {
    this.showFlightNumber = checked;
    if (!checked) {
      this.additionalInfoForm.get('flightNumber')?.reset();
    }
  }

  public onSubmit(): void {
    if (this.additionalInfoForm.valid) {
      this.formSubmitted.emit(this.additionalInfoForm.value);
    }
  }
}
