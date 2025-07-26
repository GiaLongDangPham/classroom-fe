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
import { ToastrService } from 'ngx-toastr';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>, 
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const token = authService.getToken();

  let authReq = req;
  if (token && !req.url.includes('/refresh-token')) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || !req.url.includes('/auth')) {
        debugger
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout(); // Không có refresh -> logout luôn
          window.location.href = '/login';
          toastr.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap((res) => {
            debugger
            // Dùng trực tiếp token mới từ response
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${res.token}`)
            });

            return next(newReq);
          }),
          catchError((refreshError) => {
            debugger
            //Nếu refresh cũng fail -> Logout
            authService.logout();
            window.location.href = '/login';
            toastr.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
