import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
