import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { environment } from '../environments/environment';

/**
 * Aplicação Pública — rede isolada (DMZ), acesso SEM autenticação (RN-6.1, RN-6.8).
 * IMPORTANTE: este app NÃO referencia @tce/tce-proxy — não há guard, login ou token.
 * Consome apenas endpoints anônimos (/api/publico/*).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),

    // 0.11 — Interceptor global de erros HTTP + console em dev (tce-http)
    provideTceHttpErrorInterceptor(
      {
        tempoDeVidaMensagemInterceptorError: 5000,
        incluirInterceptorMensagemError: true,
        incluirInterceptorConsoleError: !environment.production,
      },
      environment,
    ),

    provideTceCommonServices(),
    provideTceCommonPipes(),
  ],
};
