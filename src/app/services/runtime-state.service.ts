import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RuntimeStateService {
    private _offline$ = new BehaviorSubject<boolean>(false);
    readonly offline$ = this._offline$.asObservable();

    get offline(): boolean { return this._offline$.value; }
    setOffline(v: boolean) { this._offline$.next(v); }
}
