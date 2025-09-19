import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../user.model';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree | any => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const roles = route.data?.['roles'] as UserRole[] | undefined;

    if (auth.isAuthenticated) {
        if (roles && (!auth.role || !roles.includes(auth.role))) {
            const mapRole: Record<UserRole, string> = {
                admin: '/admin-dashboard',
                technician: '/technician-dashboard',
                client: '/client-dashboard'
            };
            return router.createUrlTree([mapRole[auth.role as UserRole] ?? '/login']);
        }
        return true;
    }

    if (!auth.hasStoredToken()) {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    return auth.currentUser$.pipe(
        filter(u => u !== null || !auth.hasStoredToken()),
        take(1),
        map(u => {
            if (!u) {
                return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
            }
            if (roles && !roles.includes(u.role)) {
                const mapRole: Record<UserRole, string> = {
                    admin: '/admin-dashboard',
                    technician: '/technician-dashboard',
                    client: '/client-dashboard'
                };
                return router.createUrlTree([mapRole[u.role] ?? '/login']);
            }
            return true;
        })
    );
};