import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, from, merge, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { StatusTempoReal } from '../../core/models/status.model';
import { StatusTempoRealService } from '../../core/services/status-tempo-real.service';
import { StatusTempoRealComponent } from './status-tempo-real.component';

/**
 * Componente inteligente (Smart) da página de acompanhamento em tempo real (escopo §5).
 * Atualiza automaticamente a cada minuto (polling) e por botão manual, e navega para a
 * consulta de relatórios do usuário. Acesso público, sem autenticação.
 */
@Component({
  selector: 'app-monitoramento-tempo-real',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusTempoRealComponent],
  template: `
    <section class="flex flex-col gap-5">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Acompanhamento em tempo real</h1>
          <p class="text-sm text-neutral-500">
            Estado atual das aplicações do TCE-MG.
            @if (status?.atualizadoEm) {
              <span> Atualizado em {{ status?.atualizadoEm | date: 'dd/MM/yyyy HH:mm:ss' }}.</span>
            }
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm font-medium"
            (click)="atualizarManual()"
            [disabled]="carregando"
          >
            {{ carregando ? 'Atualizando…' : 'Atualizar' }}
          </button>
          <a
            routerLink="/autenticar"
            class="px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm font-medium"
          >
            Validar autenticidade
          </a>
          <a
            routerLink="/consulta"
            class="px-4 py-2 rounded-md bg-red-700 text-white text-sm font-medium hover:bg-red-800"
          >
            Consultar relatórios
          </a>
        </div>
      </header>

      @if (erro) {
        <p class="text-red-600">Não foi possível carregar o estado atual. Tente novamente.</p>
      }

      <app-status-tempo-real [servicos]="status?.servicos ?? []"></app-status-tempo-real>
    </section>
  `,
})
export class MonitoramentoTempoRealComponent implements OnInit, OnDestroy {
  private readonly service = inject(StatusTempoRealService);
  private readonly refresh$ = new Subject<void>();
  private subscription?: Subscription;

  status: StatusTempoReal | null = null;
  carregando = false;
  erro = false;

  ngOnInit(): void {
    // Auto-refresh (timer imediato + a cada intervalo) combinado ao refresh manual.
    this.subscription = merge(timer(0, this.service.intervaloAtualizacaoMs), this.refresh$)
      .pipe(switchMap(() => from(this.carregar())))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  atualizarManual(): void {
    this.refresh$.next();
  }

  private async carregar(): Promise<void> {
    this.carregando = true;
    this.erro = false;
    try {
      this.status = await this.service.obterStatus();
    } catch {
      this.erro = true;
    } finally {
      this.carregando = false;
    }
  }
}
