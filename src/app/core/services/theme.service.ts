import { Injectable } from '@angular/core';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: Theme = this.getSavedTheme();

  constructor() {
    this.applyTheme(this.currentTheme);
  }

  private getSavedTheme(): Theme {
    return (localStorage.getItem('theme') as Theme) || Theme.Light;
  }

  private applyTheme(theme: Theme): void {
    if (theme === Theme.Dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  public get theme(): string {
    return this.currentTheme;
  }

  public toggleTheme(): void {
    this.currentTheme = this.currentTheme === Theme.Light ? Theme.Dark : Theme.Light;
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }
}
