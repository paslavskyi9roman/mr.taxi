import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { LanguageEnum } from '../../../core/models/language.enum';
import { MtButtonComponent } from '../mt-button/mt-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeSwitcherComponent, DropdownMenuComponent, MtButtonComponent, RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public selectedLanguage: string =
    localStorage.getItem('selectedLanguage') || LanguageEnum.English;
  private translate: TranslateService = inject(TranslateService);
  public isLoggedIn = false;
  private snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(private authService: AuthService) {}

  public languages = [
    {
      value: 'English',
      label: LanguageEnum.English,
      icon: 'assets/styles/icons/flags/gb-flag.svg'
    },
    { value: 'Dutch', label: LanguageEnum.Dutch, icon: 'assets/styles/icons/flags/nl-flag.svg' },
    {
      value: 'Ukrainian',
      label: LanguageEnum.Ukrainian,
      icon: 'assets/styles/icons/flags/ua-flag.svg'
    },
    {
      value: 'German',
      label: LanguageEnum.German,
      icon: 'assets/styles/icons/flags/de-flag.svg'
    }
  ];

  public selectedFlag: string =
    this.languages.find((lang) => lang.label === this.selectedLanguage)?.icon ||
    'assets/styles/icons/flags/gb-flag.svg';

  ngOnInit(): void {
    this.authService.authState().subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  public onLanguageChange(language: LanguageEnum): void {
    const selectedItem = this.languages.find((item) => item.value === language);
    this.selectedLanguage = selectedItem?.value || LanguageEnum.English;
    this.selectedFlag = selectedItem?.icon || 'assets/styles/icons/flags/gb-flag.svg';
    this.translate.use(selectedItem!.label);
    localStorage.setItem('selectedLanguage', selectedItem!.label);
  }

  public onLogOut(): void {
    this.authService.logOut().subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('LOGOUT_SUCCESS'), '', {
          duration: 3000,
          panelClass: ['centered-snackbar']
        });
      },
      error: (error) => console.error('Log out error', error)
    });
  }
}
