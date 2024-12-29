import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
/**
* 
* Basic usage:
* <mt-link-button label="Click me"></mt-link-button>
* 
* Disabled state:
* <mt-link-button label="Disabled" [disabled]="true"></mt-link-button>
* 
 */
@Component({
    selector: 'mt-link-button',
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
