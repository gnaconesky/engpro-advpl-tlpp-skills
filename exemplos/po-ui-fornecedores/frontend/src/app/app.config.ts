import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    // withInterceptorsFromDi mantem o interceptor do PO-UI, que exibe o "message" dos erros da API
    provideHttpClient(withInterceptors([authInterceptor]), withInterceptorsFromDi()),
    importProvidersFrom(PoModule)
  ]
};
