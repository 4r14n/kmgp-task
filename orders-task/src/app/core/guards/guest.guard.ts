import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '../../features/auth/services/auth.service';

/**
 * Guest Guard (обратный guard)
 * Запрещает доступ авторизованным пользователям к страницам auth
 * Если пользователь уже авторизован - редиректит на /orders
 */
export const guestGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Пользователь уже авторизован - редирект на orders
    return router.createUrlTree(['/orders']);
  }

  // Пользователь не авторизован - разрешаем доступ к auth страницам
  return true;
};
