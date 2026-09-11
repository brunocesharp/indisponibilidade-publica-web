import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app.routes';

/**
 * Aplicação Pública — rede isolada (DMZ), acesso SEM autenticação (RN-6.1, RN-6.8).
 * IMPORTANTE: este app não possui guard, login ou token.
 * Consome apenas endpoints anônimos (/api/publico/*).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
  ],
};
