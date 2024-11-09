import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_THEME_CLASS = 'dark-theme';

  applyLightTheme() {
    document.body.classList.remove(this.DARK_THEME_CLASS);
  }

  applyDarkTheme() {
    document.body.classList.add(this.DARK_THEME_CLASS);
  }
}
