import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading.service';

@Component({
    selector: 'app-loading-overlay',
    standalone: true,
    imports: [CommonModule],
    template: `
  <div *ngIf="svc.loading$ | async" class="overlay" aria-live="polite" aria-busy="true">
    <div class="spinner" role="progressbar" aria-label="Loading"></div>
  </div>
  `,
    styles: [`
    .overlay{
      position: fixed; inset: 0; z-index: 9999;
      display: grid; place-items: center;
      background: rgba(255,255,45,0.35); backdrop-filter: blur(2px);
    }
    .spinner{
      width: 48px; height: 48px; border-radius: 999px;
      border: 4px solid rgba(255,255,255,0.35);
      border-top-color: white; animation: spin 0.9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingOverlayComponent {
    svc = inject(LoadingService);
}
