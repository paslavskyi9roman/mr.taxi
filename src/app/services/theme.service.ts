import {Injectable} from '@angular/core';
import {ThemeEnum} from '../models/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme: ThemeEnum = ThemeEnum.Light;

  public get theme(): string {
    return this.currentTheme;
  }

  public toggleTheme(): void {
    this.currentTheme = this.currentTheme === ThemeEnum.Light ? ThemeEnum.Dark : ThemeEnum.Light;

    if (this.currentTheme === ThemeEnum.Dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
