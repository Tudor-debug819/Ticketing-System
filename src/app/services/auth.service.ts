import { Injectable, inject } from "@angular/core";
import { UserService } from "./user.service";
import { BehaviorSubject, of } from "rxjs";
import { User, UserRole } from "../user.model";
import { catchError, take, map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })

export class AuthService {
    private userService = inject(UserService);

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
        console.log('[AuthService] token from storage =', token);
        if (!token) return;

        this.userService.getUsers().pipe(
            take(1),
            map(users => {
                console.log('[AuthService] users loaded =', users);
                const user = users.find(u => u.token === token) ?? null;
                console.log('[AuthService] matched user =', user);
                return user;
            }),
            catchError(err => {
                console.error('[AuthService] error fetching users.json:', err);
                return of(null);
            })
        ).subscribe(user => {
            this.currentUserSubject.next(user);
            if (!user) this.clearToken();
        });
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

