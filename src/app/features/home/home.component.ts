import { Component, inject } from '@angular/core';

import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ThemeService } from '../../core/services/theme.service';
import { Theme } from '../../core/models/theme';
import { Language } from '../../core/models/language';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslatePipe, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private translate: TranslateService = inject(TranslateService);
  protected readonly themeService: ThemeService = inject(ThemeService);
  protected readonly Language = Language;

  public get themeLabel(): string {
    return this.themeService.theme === Theme.Light ? 'Dark' : 'Light';
  }

  public switchLanguage(lang: Language): void {
    this.translate.use(lang);
  }
}
