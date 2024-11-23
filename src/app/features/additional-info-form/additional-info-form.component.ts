import {Component, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';

@Component({
  selector: 'app-additional-info-form',
  standalone: true,
  imports: [ReactiveFormsModule, MtButtonComponent],
  templateUrl: './additional-info-form.component.html',
  styleUrls: ['./additional-info-form.component.scss']
})
export class AdditionalInfoFormComponent {
  additionalInfoForm: FormGroup;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) {
    this.additionalInfoForm = this.formBuilder.group({
      luggage: [''],
      scheduledRide: [''],
      flightNumber: ['']
    });
  }

  onSubmit() {
    if (this.additionalInfoForm.valid) {
      this.formSubmitted.emit(this.additionalInfoForm.value);
    }
  }
}
