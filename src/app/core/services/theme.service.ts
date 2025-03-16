import { Injectable } from '@angular/core';
import { ThemeEnum } from '../models/theme.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: ThemeEnum = this.getSavedTheme();

  constructor() {
    this.applyTheme(this.currentTheme);
  }

  private getSavedTheme(): ThemeEnum {
    return (localStorage.getItem('theme') as ThemeEnum) || ThemeEnum.Dark;
  }

  private applyTheme(theme: ThemeEnum): void {
    if (theme === ThemeEnum.Dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  public get theme(): string {
    return this.currentTheme;
  }

  public toggleTheme(): void {
    this.currentTheme = this.currentTheme === ThemeEnum.Light ? ThemeEnum.Dark : ThemeEnum.Light;
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }
}
