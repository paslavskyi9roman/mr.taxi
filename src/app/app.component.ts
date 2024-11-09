import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService } from './services/theme.service';
import { ThemeEnum } from './models/theme.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);
  protected themeService: ThemeService = inject(ThemeService);

  public get themeLabel(): string {
    return this.themeService.theme === ThemeEnum.Light ? 'Dark' : 'Light';
  }
  public ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
