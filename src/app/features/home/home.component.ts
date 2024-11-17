import { Component, inject } from '@angular/core';

import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ThemeService } from '../../core/services/theme.service';
import { Theme } from '../../core/models/theme';
import { Language } from '../../core/models/language';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { MtLinkButtonComponent } from '../../shared/components/mt-link-button/mt-link-button.component';
import { MtModalComponent } from '../../shared/components/mt-modal/mt-modal.component';
import { CommonModule } from '@angular/common';
import { ThemeSwitcherComponent } from '../../shared/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslatePipe, TranslateModule, MtButtonComponent, MtLinkButtonComponent, CommonModule, MtModalComponent, ThemeSwitcherComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private translate: TranslateService = inject(TranslateService);
  protected readonly themeService: ThemeService = inject(ThemeService);
  protected readonly Language = Language;
  public isModalOpen = false;

  public get themeLabel(): string {
    return this.themeService.theme === Theme.Light ? 'Dark' : 'Light';
  }

  public switchLanguage(lang: Language): void {
    this.translate.use(lang);
    this.isModalOpen = false;
  }

  public openLanguageModal(): void {
    this.isModalOpen = true;
  }

  public handleConfirm(): void {
    this.isModalOpen = false;
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }
}
