import { Component, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { Language } from '../../../core/models/language';
import {MtButtonComponent} from '../mt-button/mt-button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeSwitcherComponent, DropdownMenuComponent, MtButtonComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public selectedLanguage: string = localStorage.getItem('selectedLanguage') || Language.English;
  private translate: TranslateService = inject(TranslateService);

  public languages = [
    { value: 'English', label: Language.English, icon: 'assets/styles/icons/flags/gb-flag.svg' },
    { value: 'Dutch', label: Language.Dutch, icon: 'assets/styles/icons/flags/nl-flag.svg' },
    { value: 'Ukrainian', label: Language.Ukrainian, icon: 'assets/styles/icons/flags/ua-flag.svg' }
  ];

  public selectedFlag: string =
    this.languages.find((lang) => lang.label === this.selectedLanguage)?.icon ||
    'assets/styles/icons/flags/gb-flag.svg';

  public onLanguageChange(language: Language): void {
    const selectedItem = this.languages.find((item) => item.value === language);
    this.selectedLanguage = selectedItem?.value || Language.English;
    this.selectedFlag = selectedItem?.icon || 'assets/styles/icons/flags/gb-flag.svg';
    this.translate.use(selectedItem!.label);
    localStorage.setItem('selectedLanguage', selectedItem!.label);
  }
}
