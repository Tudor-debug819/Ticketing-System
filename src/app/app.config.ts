import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { networkStateInterceptor } from './interceptors/network-state.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { AuthService } from './services/auth.service';
import { SimpleNotificationsModule } from 'angular2-notifications';

function initAuth(auth: AuthService) {
  return () => auth.loadSession();
}

export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(routes),

    provideHttpClient(withInterceptors([
      loadingInterceptor,
      authInterceptor,
      networkStateInterceptor,
      errorInterceptor,

    ])),
    { provide: APP_INITIALIZER, useFactory: initAuth, deps: [AuthService], multi: true },

    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};
