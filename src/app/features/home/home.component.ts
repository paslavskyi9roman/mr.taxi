import { Component } from '@angular/core';

import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { TaxiOrderFormComponent } from '../taxi-order-form/taxi-order-form.component';

@Component({
    selector: 'app-home',
    imports: [TranslatePipe, TranslateModule, CommonModule, TaxiOrderFormComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}
