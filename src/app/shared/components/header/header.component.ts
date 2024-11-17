import { Component, inject } from '@angular/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { Language } from '../../../core/models/language';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ThemeSwitcherComponent,
    DropdownMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public selectedLanguage: string = Language.English;
  private translate: TranslateService = inject(TranslateService);

  public languages = [
    { value: 'English', label: Language.English, icon: 'assets/styles/icons/flags/en-flag.svg' },
    { value: 'Dutch', label: Language.Dutch, icon: 'assets/styles/icons/flags/nl-flag.svg' },
    { value: 'Ukrainian', label: Language.Ukrainian, icon: 'assets/styles/icons/flags/ua-flag.svg' }
  ];

  public onLanguageChange(language: Language): void {
    const selectedItem = this.languages.find(item => item.value === language);
    this.selectedLanguage = selectedItem?.value || Language.English;
    this.translate.use(selectedItem!.label);
    localStorage.setItem('selectedLanguage', selectedItem!.label);
  }
}
