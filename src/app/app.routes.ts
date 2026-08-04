import { Routes } from '@angular/router';

/**
 * Rotas públicas — SEM AuthGuard (acesso anônimo, RN-6.1). Aplicação Pública (DMZ):
 *  - /tempo-real: acompanhamento em tempo real (auto-refresh 1 min + botão manual)
 *  - /consulta:   consulta do relatório por limiar (d-1) + download de PDF
 */
export const routes: Routes = [
  {
    path: 'tempo-real',
    loadComponent: () =>
      import('./features/tempo-real/monitoramento-tempo-real.component').then(
        (c) => c.MonitoramentoTempoRealComponent,
      ),
  },
  {
    path: 'consulta',
    loadComponent: () =>
      import('./features/consulta/consulta-relatorio.component').then((c) => c.ConsultaRelatorioComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tempo-real' },
  { path: '**', redirectTo: 'tempo-real' },
];
