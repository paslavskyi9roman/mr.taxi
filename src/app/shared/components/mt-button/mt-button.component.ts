import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'mt-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './mt-button.component.html',
  styleUrl: './mt-button.component.scss'
})
export class MtButtonComponent {
  @Input() label: string = '';
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
}
