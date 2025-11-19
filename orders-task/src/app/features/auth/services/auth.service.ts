import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';

  isAuthenticated = signal<boolean>(this.hasToken());

  /**
   * Fake login - принимает любые credentials и генерирует токен
   */
  login(email: string, _password: string): Observable<{ token: string }> {
    // Генерация fake токена
    const fakeToken = btoa(`${email}:${Date.now()}`);

    // Сохранение токена в localStorage
    localStorage.setItem(this.TOKEN_KEY, fakeToken);
    this.isAuthenticated.set(true);

    // Симуляция задержки сети (500ms)
    return of({ token: fakeToken }).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Проверка наличия токена (синхронная)
   */
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  /**
   * Приватный метод для проверки наличия токена
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }
}
