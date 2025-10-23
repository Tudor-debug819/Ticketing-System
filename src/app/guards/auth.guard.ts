import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole, User } from '../user.model';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree | any => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const roles = route.data?.['roles'] as UserRole[] | undefined;

    if (auth.isAuthenticated) {
        const role = auth.role;
        if (roles && role && !roles.includes(role)) {
            const mapRole: Record<UserRole, string> = {
                admin: '/admin-dashboard',
                technician: '/technician-dashboard',
                client: '/client-dashboard',
            };
            return router.createUrlTree([mapRole[role] ?? '/login']);
        }
        return true;
    }

    return auth.currentUser$.pipe(
        take(1),
        map((user: User | null) => {
            if (!user) {
                return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
            }

            if (roles && !roles.includes(user.role as UserRole)) {
                const mapRole: Record<UserRole, string> = {
                    admin: '/admin-dashboard',
                    technician: '/technician-dashboard',
                    client: '/client-dashboard',
                };
                // 👇 tiparește cheie ca UserRole
                return router.createUrlTree([mapRole[user.role as UserRole] ?? '/login']);
            }

            return true;
        })
    );
};
