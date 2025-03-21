import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { TranslatePipe } from '@ngx-translate/core';

import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { MtSlideToggleComponent } from '../../shared/components/mt-slide-toggle/mt-slide-toggle.component';
import { AdditionalInfo } from '../../core/models/additional-info.model';

@Component({
  selector: 'app-additional-info-form',
  imports: [
    ReactiveFormsModule,
    MtButtonComponent,
    CommonModule,
    MtSlideToggleComponent,
    NgOptimizedImage,
    TranslatePipe
  ],
  templateUrl: './additional-info-form.component.html',
  styleUrls: ['./additional-info-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalInfoFormComponent implements OnInit {
  public additionalInfoForm: FormGroup;
  @Output() public formSubmitted = new EventEmitter<AdditionalInfo>();

  public showLuggage = true;
  public showScheduledRide = true;
  public showFlightNumber = true;
  public currentTime = '';
  public selectedLuggage: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.additionalInfoForm = this.formBuilder.group({
      luggage: [''],
      rideDate: [''],
      rideTime: [''],
      flightNumber: ['']
    });
  }

  ngOnInit(): void {
    this.getCurrentTime();
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

  public getCurrentTime(): void {
    this.currentTime = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public selectLuggage(type: string): void {
    this.selectedLuggage = type;
    this.additionalInfoForm.get('luggage')?.setValue(type);
  }
}
