import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { RuntimeStateService } from '../services/runtime-state.service';

export const networkStateInterceptor: HttpInterceptorFn = (req, next) => {
  const state = inject(RuntimeStateService);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        if (state.offline) state.setOffline(false);
      }
    }),
    catchError(err => {
      if (err?.status === 0) state.setOffline(true);
      return throwError(() => err);
    })
  );
};
