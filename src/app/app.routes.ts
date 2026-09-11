import { Routes } from '@angular/router';

/**
 * Rotas públicas — SEM AuthGuard (acesso anônimo, RN-6.1). Aplicação Pública (DMZ):
 *  - /tempo-real: acompanhamento em tempo real (auto-refresh 1 min + botão manual)
 *  - /consulta:   consulta do relatório por limiar (d-1) + download de PDF
 *  - /autenticar: validação de autenticidade do relatório por código verificador (F8)
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
  {
    path: 'autenticar',
    loadComponent: () => import('./features/autenticacao/autenticacao.component').then((c) => c.AutenticacaoComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tempo-real' },
  { path: '**', redirectTo: 'tempo-real' },
];
