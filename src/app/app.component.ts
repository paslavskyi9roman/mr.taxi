import { Component, inject, OnInit } from '@angular/core';

import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Language } from './core/models/language';
import { LayoutComponent } from './shared/components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslatePipe, TranslateModule, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);

  public ngOnInit(): void {
    this.translate.setDefaultLang(Language.English);
    this.translate.use(Language.English);
  }
}
