import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>, 
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout(); // Không có refresh -> logout luôn
          window.location.href = '/login';
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap((res) => {
            const newAccessToken = authService.getToken();
            if (!newAccessToken) return throwError(() => error);

            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`)
            });

            return next(newReq);
          }),
          catchError((refreshError) => {
            //Nếu refresh cũng fail -> Logout
            authService.logout();
            window.location.href = '/login';
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
