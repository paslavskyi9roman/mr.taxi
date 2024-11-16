import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mt-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mt-modal.component.html',
  styleUrl: './mt-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtModalComponent {
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<unknown>();
}