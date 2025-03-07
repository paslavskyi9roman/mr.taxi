import { Component, inject, OnInit } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Language } from './core/models/language';
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
    const savedLanguage = localStorage.getItem('selectedLanguage') || Language.Dutch;
    this.translate.setDefaultLang(Language.Dutch);
    this.translate.use(savedLanguage);
  }
}
