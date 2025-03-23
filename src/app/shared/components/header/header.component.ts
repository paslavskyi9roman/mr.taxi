import { Component, inject, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';

import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { LanguageEnum } from '../../../core/models/language.enum';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ThemeSwitcherComponent,
    DropdownMenuComponent,
    RouterLink,
    MatMenuModule,
    MatIconModule,
    MatButton
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public selectedLanguage: string =
    localStorage.getItem('selectedLanguage') || LanguageEnum.English;
  private translate: TranslateService = inject(TranslateService);
  public isLoggedIn = false;
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  public isMobile = window.innerWidth < 600;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile = (event.target as Window).innerWidth < 600;
  }

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
        this.router.navigate(['/home']);

        this.snackBar.open(this.translate.instant('AUTH.LOGOUT_SUCCESS'), '', {
          duration: 3000,
          panelClass: ['centered-snackbar']
        });
      },
      error: (error) => console.error('Log out error', error)
    });
  }
}
