import { Injectable, inject } from "@angular/core";
import { UserService } from "./user.service";
import { BehaviorSubject, of } from "rxjs";
import { User, UserRole } from "../user.model";
import { catchError, take, map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })

export class AuthService {
    private userService = inject(UserService);
    private router = inject(Router);

    private readonly STORAGE_KEY = 'auth_user';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor() {

        this.hydrateFromToken();

    }

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    get isAuthenticated(): boolean {
        return !!this.currentUserSubject.value?.token;
    }

    get role(): UserRole | null {
        return this.currentUserSubject.value?.role ?? null;
    }

    private hydrateFromToken(): void {
        const token = this.readToken();
        if (!token) return;

        this.userService.getUsers().pipe(
            take(1),
            map(users => {
                const found: any = users.find(u => (u as any).token === token);
                if (!found) return null;
                const safeUser: User = {
                    id: found.id,
                    name: found.name,
                    email: found.email,
                    role: found.role,
                    token: found.token
                };
                return safeUser;
            }),
            catchError(() => of(null))
        ).subscribe(user => {
            this.currentUserSubject.next(user);
            if (!user) this.clearToken();
        });
    }

    login(email: string, password: string) {
        return this.userService.getUsers().pipe(
            take(1),
            map(users => {
                const found: any = users.find(u => u.email === email && (u as any).password === password);
                if (!found) throw new Error('Invalid credentials');

                const safeUser: User = {
                    id: found.id,
                    name: found.name,
                    email: found.email,
                    role: found.role,
                    token: found.token
                };

                this.setUser(safeUser);
                return safeUser;
            })
        );
    }

    logout(): void {
        this.clearUser();
        this.router.navigate(['/login']);
    }

    navigateAfterLogin(role: UserRole) {
        let target: string;
        switch (role) {
            case 'admin':
                target = '/admin-dashboard';
                break;
            case 'technician':
                target = '/technician-dashboard';
                break;
            case 'client':
                target = '/client-dashboard';
                break;
            default:
                target = '/login';
        }

        this.router.navigate([target]);
    }

    private readToken(): string | null {
        try {
            return localStorage.getItem(this.STORAGE_KEY);
        } catch {
            return null;
        }
    }

    private writeToken(token: string): void {
        localStorage.setItem(this.STORAGE_KEY, token);
    }

    private clearToken(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    private setUser(user: User): void {
        this.currentUserSubject.next(user);
        this.writeToken(user.token);
    }

    private clearUser(): void {
        this.currentUserSubject.next(null);
        this.clearToken();
    }

}

