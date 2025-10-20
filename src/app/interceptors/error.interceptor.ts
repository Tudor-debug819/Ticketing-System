import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retryWhen, scan, mergeMap } from 'rxjs/operators';
import { throwError, timer } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const isIdempotentGet = req.method === 'GET';

    return next(req).pipe(
        retryWhen(errors => isIdempotentGet ? errors.pipe(
            scan((acc, err) => {
                if (acc >= 3) throw err;
                if (err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500) throw err;
                return acc + 1;
            }, 0),
            mergeMap(retryCount => timer(300 * Math.pow(2, Math.max(0, retryCount - 1))))
        ) : throwError(() => errors)),
        catchError((error: any) => {
            if (!(error instanceof HttpErrorResponse)) {
                return throwError(() => error);
            }

            if (error.status === 0) {
                return throwError(() => error);
            }

            switch (error.status) {
                case 401:
                    router.navigate(['/login'], { queryParams: { returnUrl: location.pathname } });
                    break;
                case 403:
                    break;
                case 404:
                    break;
                case 409:
                    break;
                case 422:
                    break;
                case 429:
                    break;
                default:
                    if (error.status >= 500) {
                    }
            }

            return throwError(() => error);
        })
    );
};
