import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mt-slide-toggle',
  imports: [],
  templateUrl: './mt-slide-toggle.component.html',
  styleUrl: './mt-slide-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtSlideToggleComponent {
  @Input() public checked = false;
  @Input() public label = '';
  @Output() public readonly checkedChange = new EventEmitter<boolean>();

  public onToggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
