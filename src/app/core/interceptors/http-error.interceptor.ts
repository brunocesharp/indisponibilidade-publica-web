import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

/** Loga erros HTTP no console fora de produção. */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (!environment.production) {
        console.error(`[HTTP] ${req.method} ${req.url} falhou:`, erro);
      }
      return throwError(() => erro);
    }),
  );
