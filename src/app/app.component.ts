import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TceFooterComponent } from '@tce/tce-components';
import { TceHttpLoadingService } from '@tce/tce-http';

/**
 * Shell da Aplicação Pública: cabeçalho público (sem login), navegação por abas entre
 * Tempo Real e Relatório de Limiar (escopo §5). Sem toolbar autenticada.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, TceFooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-neutral-100">
      <header class="bg-blue-900 text-white px-6 md:px-8 h-[60px] flex items-center justify-between shadow-md shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white rounded-md flex items-center justify-center font-bold text-blue-900 text-sm">
            TC
          </div>
          <div>
            <div class="text-[15px] font-semibold leading-tight">Monitoramento de Indisponibilidade</div>
            <div class="text-xs opacity-75">TCE-MG — Tribunal de Contas do Estado de Minas Gerais</div>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-medium bg-white/15 px-3 py-1.5 rounded-full">
          <span class="w-[7px] h-[7px] rounded-full bg-green-400"></span>
          Acesso público
        </div>
      </header>

      <nav class="bg-white border-b border-neutral-200 px-6 md:px-8 flex gap-1 shrink-0">
        <a
          routerLink="/tempo-real"
          routerLinkActive="!text-blue-700 !border-blue-700"
          class="inline-flex items-center gap-2 px-4 py-3.5 text-[13px] font-semibold text-neutral-500 border-b-[3px] border-transparent hover:text-neutral-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Acompanhamento em Tempo Real
        </a>
        <a
          routerLink="/consulta"
          routerLinkActive="!text-blue-700 !border-blue-700"
          class="inline-flex items-center gap-2 px-4 py-3.5 text-[13px] font-semibold text-neutral-500 border-b-[3px] border-transparent hover:text-neutral-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Relatório de Limiar
        </a>
      </nav>

      @if (loading$ | async) {
        <div class="loading-overlay" aria-busy="true">Carregando…</div>
      }

      <main class="flex-1 px-6 md:px-8 py-7 max-w-[1180px] mx-auto w-full">
        <router-outlet></router-outlet>
      </main>

      <tce-footer></tce-footer>
    </div>
  `,
})
export class AppComponent {
  private readonly loadingService = inject(TceHttpLoadingService);
  loading$ = this.loadingService.getLoad();
}
