import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/**
 * So atua no navegador: adiciona Authorization (Basic) e tenantId.
 * Dentro do Protheus quem faz isso e o protheus-lib-core.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.insideProtheus() || req.url.includes('assets/')) {
    return next(req);
  }

  const token = auth.getToken();
  const request = token
    ? req.clone({ setHeaders: { Authorization: `Basic ${token}`, tenantId: environment.tenantId } })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
