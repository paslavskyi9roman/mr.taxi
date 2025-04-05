import { Component, inject, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { LanguageEnum } from '../../../core/models/language.enum';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ThemeSwitcherComponent,
    DropdownMenuComponent,
    RouterLink,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public selectedLanguage: string =
    localStorage.getItem('selectedLanguage') || LanguageEnum.Dutch;
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

  public selectLanguage(language: string): void {
    const selectedItem = this.languages.find((item) => item.value === language);
    if (selectedItem) {
      this.selectedLanguage = selectedItem.value;
      this.selectedFlag = selectedItem.icon;
      this.translate.use(selectedItem.label);
      localStorage.setItem('selectedLanguage', selectedItem.label);
    }
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
