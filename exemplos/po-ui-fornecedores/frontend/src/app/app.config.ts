import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { ProAppConfigService, ProtheusLibCoreModule } from '@totvs/protheus-lib-core';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Rotas com # porque, dentro do Protheus, o app e servido de uma subpasta
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    // withInterceptorsFromDi mantem os interceptors do PO-UI (mensagens de erro) e do
    // protheus-lib-core (URL do REST, token e empresa/filial quando aberto pelo FwCallApp)
    provideHttpClient(withInterceptors([authInterceptor]), withInterceptorsFromDi()),
    importProvidersFrom(PoModule, ProtheusLibCoreModule),
    // Carrega o appConfig.json antes da primeira chamada a API
    provideAppInitializer(() => inject(ProAppConfigService).loadAppConfig())
  ]
};
