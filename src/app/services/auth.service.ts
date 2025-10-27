import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserRole } from '../user.model';
import { RuntimeStateService } from './runtime-state.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private _currentUser$ = new BehaviorSubject<User | null>(null);
    currentUser$ = this._currentUser$.asObservable();

    constructor(private http: HttpClient, private router: Router, private state: RuntimeStateService) { }

    hasStoredToken() { return !!localStorage.getItem('token'); }
    get token() { return localStorage.getItem('token'); }
    get isAuthenticated(): boolean { return !!this._currentUser$.value; }
    get role(): UserRole | null { return this._currentUser$.value?.role ?? null; }
    get currentUser(): User | null {
        return this._currentUser$.value;
    }

    login(email: string, password: string) {
        return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, { email, password })
            .pipe(
                tap(res => {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('last_user', JSON.stringify(res.user));
                    this._currentUser$.next(res.user);
                    this.state.setOffline(false);
                }),
                map(res => res.user)
            );
    }

    navigateAfterLogin(role: UserRole) {
        const mapRole: Record<UserRole, string> = {
            admin: '/admin-dashboard',
            technician: '/technician-dashboard',
            client: '/client-dashboard',
        };
        this.router.navigate([mapRole[role] ?? '/']);
    }

    enterOfflineIfPossible(): boolean {
        const raw = localStorage.getItem('last_user');
        if (!raw) return false;
        try {
            const u = JSON.parse(raw) as User;
            this._currentUser$.next(u);
            this.state.setOffline(true);
            return true;
        } catch {
            return false;
        }
    }

    loadSession(): Promise<void> {
        const token = this.token;
        if (!token) {
            this._currentUser$.next(null);
            return Promise.resolve();
        }

        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        return this.http
            .get<{ user: User }>(`${this.apiUrl}/session`, { headers })
            .pipe(
                tap(res => {
                    this._currentUser$.next(res.user);
                    localStorage.setItem('last_user', JSON.stringify(res.user));
                    this.state.setOffline(false);
                }),
                map(() => void 0),
                catchError(err => {
                    if (err.status === 0 && this.enterOfflineIfPossible()) {
                        this.state.setOffline(true);
                        return of(void 0);
                    }
                    return of(void 0);
                })
            )
            .toPromise();
    }

    logout() {
        localStorage.removeItem('token');
        this._currentUser$.next(null);
        this.router.navigate(['/login']);
    }
}
