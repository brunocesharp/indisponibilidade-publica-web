import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HttpLoadingService } from './core/services/http-loading.service';

/**
 * Shell da Aplicação Pública: navegação simples entre Tempo Real e Consulta
 * (escopo §5 — botão de acesso entre as duas telas). Sem toolbar autenticada.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, FooterComponent],
  template: `
    <header class="flex items-center justify-between p-4 border-b">
      <h1 class="text-xl font-semibold">Disponibilidade dos Sistemas — TCE-MG</h1>
      <nav class="flex gap-2">
        <a routerLink="/tempo-real" routerLinkActive="font-bold underline">Tempo real</a>
        <a routerLink="/consulta" routerLinkActive="font-bold underline">Consultar relatórios</a>
      </nav>
    </header>

    @if (loading$ | async) {
      <div class="loading-overlay" aria-busy="true">Carregando…</div>
    }

    <main class="p-4">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `,
})
export class AppComponent {
  private readonly loadingService = inject(HttpLoadingService);
  loading$ = this.loadingService.getLoad();
}
