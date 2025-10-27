import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';

type ApiError = { message?: string; code?: string; errors?: Record<string, string[]> };

const isLoginCall = (req: HttpRequest<unknown>) =>
    req.url.includes('/auth/login') && req.method === 'POST';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notify = inject(NotificationsService);

    return next(req).pipe(
        catchError((error: unknown) => {
            // Network / non-HTTP
            if (!(error instanceof HttpErrorResponse)) {
                notify.error('Unexpected Error', 'An unknown error occurred.');
                return throwError(() => error);
            }

            const payload = (error.error ?? {}) as ApiError;
            const code = (payload.code ?? '').toUpperCase();
            const backendMessage = payload.message || error.message || 'Unexpected error occurred.';

            // 0 = rețea/CORS/Render adormit
            if (error.status === 0) {
                notify.error('Network Error', 'Please check your internet connection.');
                return throwError(() => error);
            }

            // 401
            if (error.status === 401) {
                if (isLoginCall(req)) {
                    // Eșec autentificare (NU dezvălui dacă emailul există)
                    notify.warn('Login failed', 'Email or password is incorrect.');
                    // rămâi pe pagina curentă; nu redirect, nu mesaj de "session expired"
                    return throwError(() => error);
                }

                // Rute protejate: token lipsă/expirat
                if (code === 'TOKEN_EXPIRED') {
                    notify.warn('Session expired', 'Please log in again.');
                } else {
                    notify.warn('Unauthorized', 'Please log in to continue.');
                }
                localStorage.removeItem('token');
                router.navigate(['/login'], { queryParams: { returnUrl: location.pathname } });
                return throwError(() => error);
            }

            // 403
            if (error.status === 403) {
                notify.warn('Access denied', 'You do not have permission to perform this action.');
                return throwError(() => error);
            }

            // 404
            if (error.status === 404) {
                notify.error('Not found', 'Requested resource was not found.');
                return throwError(() => error);
            }

            // 409 (ex: email deja folosit la register)
            if (error.status === 409) {
                notify.warn('Conflict', backendMessage);
                return throwError(() => error);
            }

            // 422 – afișează erori de câmp dacă vin ca obiect
            if (error.status === 422) {
                if (payload.errors) {
                    const list = Object.entries(payload.errors)
                        .map(([k, v]) => `${k}: ${v.join(', ')}`)
                        .join('\n');
                    notify.warn('Validation Error', list || backendMessage);
                } else {
                    notify.warn('Validation Error', backendMessage);
                }
                return throwError(() => error);
            }

            // 429 – rate limit
            if (error.status === 429 || code === 'TOO_MANY_ATTEMPTS') {
                notify.warn('Too many attempts', 'Please wait a moment and try again.');
                return throwError(() => error);
            }

            // 5xx
            if (error.status >= 500) {
                notify.error('Server Error', 'Something went wrong on the server.');
                return throwError(() => error);
            }

            // fallback
            notify.error('Error', backendMessage);
            return throwError(() => error);
        })
    );
};
