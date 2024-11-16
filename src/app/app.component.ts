import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Theme } from './core/models/theme';
import { Language } from './core/models/language';
import {ThemeService} from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);
  protected readonly themeService: ThemeService = inject(ThemeService);
  protected readonly Language = Language;

  public get themeLabel(): string {
    return this.themeService.theme === Theme.Light ? 'Dark' : 'Light';
  }

  public ngOnInit(): void {
    this.translate.setDefaultLang(Language.English);
    this.translate.use(Language.English);
  }

  public switchLanguage(lang: Language): void {
    this.translate.use(lang);
  }
}
