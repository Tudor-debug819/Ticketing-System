import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notify = inject(NotificationsService);

    return next(req).pipe(
        catchError((error: any) => {
            if (error instanceof HttpErrorResponse) {
                // extragem mesajul de la backend, dacă există
                const backendMessage =
                    error.error?.message || error.message || 'Unexpected error occurred.';

                switch (error.status) {
                    case 0:
                        notify.error('Network Error', 'Please check your internet connection.');
                        break;

                    case 401:
                        notify.warn('Unauthorized', 'Your session expired. Please log in again.');
                        router.navigate(['/login'], { queryParams: { returnUrl: location.pathname } });
                        break;

                    case 403:
                        notify.warn('Access Denied', 'You are not allowed to access this resource.');
                        break;

                    case 404:
                        notify.error('Not Found', 'Requested resource was not found.');
                        break;

                    case 409:
                        notify.warn('Conflict', backendMessage);
                        break;

                    case 422:
                        notify.warn('Validation Error', backendMessage);
                        break;

                    case 429:
                        notify.warn('Too Many Requests', 'Please wait a moment and try again.');
                        break;

                    default:
                        if (error.status >= 500) {
                            notify.error('Server Error', 'Something went wrong on the server.');
                        } else {
                            notify.error('Error', backendMessage);
                        }
                        break;
                }
            } else {
                notify.error('Unexpected Error', 'An unknown error occurred.');
            }

            return throwError(() => error);
        })
    );
};
