import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ThemeService} from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);
  private themeService: ThemeService = inject(ThemeService);
  protected isDarkMode = false;

  public ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  protected toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.themeService.applyDarkTheme();
    } else {
      this.themeService.applyLightTheme();
    }
  }
}
