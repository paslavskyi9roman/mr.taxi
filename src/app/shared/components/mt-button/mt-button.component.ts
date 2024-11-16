import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';
/**
 *
 * Basic usage:
 * <mt-button label="Primary Button"></mt-button>
 *
 * Secondary variant:
 * <mt-button label="Secondary Button" type="secondary"></mt-button>
 *
 * Disabled state:
 * <mt-button label="Disabled Button" [disabled]="true"></mt-button>
 *
 */
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
