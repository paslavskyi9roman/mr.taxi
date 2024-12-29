import { Component } from '@angular/core';
import { MtLinkButtonComponent } from '../mt-link-button/mt-link-button.component';

@Component({
  selector: 'app-footer',
  imports: [MtLinkButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {}
