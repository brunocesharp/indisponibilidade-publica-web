import { Routes } from '@angular/router';

/**
 * Rotas públicas — SEM AuthGuard (acesso anônimo, RN-6.1).
 * Entrega 4 implementa as telas definitivas:
 *  - /tempo-real: acompanhamento em tempo real (auto-refresh 1 min + botão manual)
 *  - /consulta:   consulta do relatório por limiar (d-1) + download de PDF
 */
export const routes: Routes = [
  {
    path: 'tempo-real',
    loadComponent: () =>
      import('./features/tempo-real/tempo-real.component').then((c) => c.TempoRealComponent),
  },
  {
    path: 'consulta',
    loadComponent: () =>
      import('./features/consulta/consulta.component').then((c) => c.ConsultaComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tempo-real' },
  { path: '**', redirectTo: 'tempo-real' },
];
