import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mt-slide-toggle',
  standalone: true,
  imports: [],
  templateUrl: './mt-slide-toggle.component.html',
  styleUrl: './mt-slide-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtSlideToggleComponent {
  @Input() checked = false;
  @Input() label = '';
  @Output() change = new EventEmitter<boolean>();

  onToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.change.emit(checked);
  }
}
