import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/clickOutside.directive';

interface DropdownItem {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [
    CommonModule, ClickOutsideDirective
  ],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuComponent {
  @Input() items: DropdownItem[] = []
  @Input() placeholder: string = 'Select an option';
  @Output() selectionChange = new EventEmitter<any>();

  isOpen = false;
  selectedItem: DropdownItem | null = null;

  public toggleDropdown(): void {
    console.log(this.items);
    this.isOpen = !this.isOpen;
  }

  public selectItem(item: DropdownItem): void {
    if (item.disabled) return;
    this.selectedItem = item;
    this.selectionChange.emit(item.value);
    this.isOpen = false;
  }
}
