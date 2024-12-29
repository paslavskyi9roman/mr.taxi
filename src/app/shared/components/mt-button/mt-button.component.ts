import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
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
 * Size variants:
 * <mt-button label="Large Button" size="large"></mt-button>
 * <mt-button label="Medium Button" size="medium"></mt-button>
 *
 */
@Component({
  selector: 'mt-button',
  imports: [NgClass],
  templateUrl: './mt-button.component.html',
  styleUrls: ['./mt-button.component.scss']
})
export class MtButtonComponent {
  @Input() label: string = '';
  @Input() type: 'primary' | 'secondary' | 'add' = 'primary';
  @Input() disabled: boolean = false;
  @Input() size: 'large' | 'medium' = 'large';
}
