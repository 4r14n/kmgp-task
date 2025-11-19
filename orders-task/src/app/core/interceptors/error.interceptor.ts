import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Произошла ошибка';

      if (error.status === 0) {
        errorMessage = 'Ошибка соединения с сервером';
      } else if (error.status === 401) {
        errorMessage = 'Требуется авторизация';
        authService.logout();
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        errorMessage = 'Доступ запрещён';
      } else if (error.status === 404) {
        errorMessage = 'Ресурс не найден';
      } else if (error.status >= 500) {
        errorMessage = 'Ошибка сервера. Попробуйте позже';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      toastService.error(errorMessage);

      return throwError(() => error);
    }),
  );
};
