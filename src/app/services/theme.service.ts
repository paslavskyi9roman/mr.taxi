import { Injectable } from '@angular/core';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: Theme = Theme.Light;

  public get theme(): string {
    return this.currentTheme;
  }

  public toggleTheme(): void {
    this.currentTheme = this.currentTheme === Theme.Light ? Theme.Dark : Theme.Light;

    if (this.currentTheme === Theme.Dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
