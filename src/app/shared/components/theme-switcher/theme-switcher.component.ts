import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '../../../core/services/theme.service';
import { ThemeEnum } from '../../../core/models/theme.enum';

@Component({
  selector: 'mt-theme-switcher',
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSwitcherComponent {
  private themeService = inject(ThemeService);

  public get themeIconPath(): string {
    return this.themeService.theme === ThemeEnum.Light
      ? 'assets/styles/icons/dark-theme.svg'
      : 'assets/styles/icons/light-theme.svg';
  }

  public get themeIcon(): string {
    return this.themeService.theme === ThemeEnum.Light ? 'dark_mode' : 'light_mode';
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
