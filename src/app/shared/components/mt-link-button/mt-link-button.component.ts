import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'mt-link-button',
  standalone: true,
  imports: [NgClass],
  styleUrls: ['./mt-link-button.component.scss'],
  template: `<a
    class="mt-link-button"
    [ngClass]="{ 'mt-link-button--disabled': disabled }"
    [attr.aria-disabled]="disabled"
  >
    {{ label }}
  </a> `
})
export class MtLinkButtonComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
}
