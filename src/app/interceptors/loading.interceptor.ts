import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loading = inject(LoadingService);

    const skip = req.url.includes('/assets/')
        || req.headers.has('X-Skip-Loading');

    if (!skip) loading.start();

    return next(req).pipe(
        finalize(() => { if (!skip) loading.stop(); })
    );
};
