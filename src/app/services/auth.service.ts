import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import{User, UserRole} from '../user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:3000/auth';
    private _currentUser$ = new BehaviorSubject<User | null>(null);
    currentUser$ = this._currentUser$.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

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
                    this._currentUser$.next(res.user);
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
            return true;
        } catch {
            return false;
        }
    }

    loadSession() {
        const token = this.token;
        if (!token) { this._currentUser$.next(null); return; }
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        this.http.get<{ user: User; offline: boolean }>(`${this.apiUrl}/session`, { headers })
            .pipe(
                tap(res => this._currentUser$.next(res.user)),
                catchError(() => { this.logout(); return of(null); })
            ).subscribe();
    }

    logout() {
        localStorage.removeItem('token');
        this._currentUser$.next(null);
        this.router.navigate(['/login']);
    }
}
