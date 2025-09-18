import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../user.model";

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated) {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const roles = route.data?.['roles'] as UserRole[] | undefined;
    if (roles && (!auth.role || !roles.includes(auth.role))) {
        const role = auth.role;
        if (role) {
            const map: Record<UserRole, string> = {
                'admin': '/admin-dashboard',
                'technician': '/technician-dashboard',
                'client': '/client-dashboard',
            };
            return router.createUrlTree([map[role] ?? '/login']);
        }
        return router.createUrlTree(['/login']);
    }
    return true;
}