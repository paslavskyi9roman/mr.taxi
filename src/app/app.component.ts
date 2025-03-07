import { Component, inject, OnInit } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { LanguageEnum } from './core/models/language.enum';
import { LayoutComponent } from './shared/components/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [TranslateModule, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);

  public ngOnInit(): void {
    const savedLanguage = localStorage.getItem('selectedLanguage') || LanguageEnum.Dutch;
    this.translate.setDefaultLang(LanguageEnum.Dutch);
    this.translate.use(savedLanguage);
  }
}
