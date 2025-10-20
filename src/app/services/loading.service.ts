import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _pending = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private showTimer: any = null;
  private lastShownAt = 0;

  private readonly showDelayMs = 120;     // nu afișa pentru request-uri ultra-rapide
  private readonly minVisibleMs = 300;    // cât stă vizibil ca să nu pâlpâie

  start() {
    this._pending++;
    if (this._pending === 1) {
      // programează afișarea după 120ms
      this.clearShowTimer();
      this.showTimer = setTimeout(() => {
        this._loading$.next(true);
        this.lastShownAt = Date.now();
      }, this.showDelayMs);
    }
  }

  stop() {
    this._pending = Math.max(0, this._pending - 1);
    if (this._pending > 0) return;

    // niciun request în curs
    if (this.showTimer) {
      // încă nu s-a afișat → anulează și nu mai arăta nimic
      this.clearShowTimer();
      return;
    }

    // deja e vizibil → respectă timpul minim
    const elapsed = Date.now() - this.lastShownAt;
    const wait = Math.max(0, this.minVisibleMs - elapsed);
    setTimeout(() => this._loading$.next(false), wait);
  }

  reset() { this._pending = 0; this.clearShowTimer(); this._loading$.next(false); }

  private clearShowTimer() {
    if (this.showTimer) { clearTimeout(this.showTimer); this.showTimer = null; }
  }
}
