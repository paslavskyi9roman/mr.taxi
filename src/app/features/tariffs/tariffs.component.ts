import { Component } from '@angular/core';
import { mockTariffs, Tariff } from './mock-tariffs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tariffs',
  templateUrl: './tariffs.component.html',
  imports: [CommonModule],
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent {
  mockTariffs: Tariff[] = mockTariffs;
}
