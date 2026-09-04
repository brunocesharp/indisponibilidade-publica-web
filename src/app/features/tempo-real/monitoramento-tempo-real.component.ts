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
 * Atualiza automaticamente a cada minuto (polling) e por botão manual, exibe contagem
 * regressiva até a próxima atualização e navega para o relatório de limiar. Acesso
 * público, sem autenticação.
 */
@Component({
  selector: 'app-monitoramento-tempo-real',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusTempoRealComponent],
  template: `
    <section class="flex flex-col gap-5">
      <div>
        <h1 class="text-[22px] font-bold text-neutral-900 tracking-tight">Acompanhamento em Tempo Real</h1>
        <p class="text-[13px] text-neutral-500 mt-1">
          Estado atual dos sistemas monitorados pelo Tribunal. Atualização automática a cada minuto.
        </p>
      </div>

      <div
        class="bg-white border border-neutral-200 rounded-xl shadow-sm px-4 py-3.5 flex items-center justify-between gap-4 flex-wrap"
      >
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-2 text-[13px] text-neutral-600">
            <span class="relative w-2 h-2 rounded-full bg-emerald-600">
              <span
                class="absolute inset-[-4px] rounded-full border-2 border-emerald-600 opacity-40 animate-ping"
              ></span>
            </span>
            <span>
              Ao vivo — próxima atualização em
              <span class="font-semibold text-blue-700 tabular-nums">{{ countdownFormatado }}</span>
            </span>
          </div>
          <div class="text-xs text-neutral-400">
            Última atualização:
            <strong class="text-neutral-700 font-semibold">
              {{ (status?.atualizadoEm | date: 'dd/MM/yyyy HH:mm:ss') || '—' }}
            </strong>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors disabled:opacity-50"
            (click)="atualizarManual()"
            [disabled]="carregando"
          >
            <svg
              class="w-[15px] h-[15px]"
              [class.animate-spin]="carregando"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ carregando ? 'Atualizando…' : 'Atualizar agora' }}
          </button>
          <a
            routerLink="/consulta"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors"
          >
            <svg class="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Relatório de Limiar
          </a>
        </div>
      </div>

      @if (erro) {
        <p class="text-red-600 text-sm">Não foi possível carregar o estado atual. Tente novamente.</p>
      }

      <div>
        <div class="text-sm font-semibold text-neutral-700 mb-3">Situação por sistema</div>
        <app-status-tempo-real
          [servicos]="status?.servicos ?? []"
          [atualizadoEm]="status?.atualizadoEm ?? null"
          [agoraMs]="agoraMs"
        ></app-status-tempo-real>
      </div>
    </section>
  `,
})
export class MonitoramentoTempoRealComponent implements OnInit, OnDestroy {
  private readonly service = inject(StatusTempoRealService);
  private readonly refresh$ = new Subject<void>();
  private subscription?: Subscription;
  private tickSubscription?: Subscription;

  private readonly intervaloSegundos = Math.round(this.service.intervaloAtualizacaoMs / 1000);

  status: StatusTempoReal | null = null;
  carregando = false;
  erro = false;
  restanteSegundos = this.intervaloSegundos;
  agoraMs = Date.now();

  get countdownFormatado(): string {
    const min = Math.floor(this.restanteSegundos / 60);
    const seg = this.restanteSegundos % 60;
    return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
  }

  ngOnInit(): void {
    // Auto-refresh (timer imediato + a cada intervalo) combinado ao refresh manual.
    this.subscription = merge(timer(0, this.service.intervaloAtualizacaoMs), this.refresh$)
      .pipe(switchMap(() => from(this.carregar())))
      .subscribe();

    // Contagem regressiva até a próxima atualização e relógio para "última verificação".
    this.tickSubscription = timer(1000, 1000).subscribe(() => {
      this.agoraMs = Date.now();
      this.restanteSegundos = this.restanteSegundos > 0 ? this.restanteSegundos - 1 : 0;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.tickSubscription?.unsubscribe();
  }

  atualizarManual(): void {
    this.refresh$.next();
  }

  private async carregar(): Promise<void> {
    this.carregando = true;
    this.erro = false;
    try {
      this.status = await this.service.obterStatus();
      this.restanteSegundos = this.intervaloSegundos;
      this.agoraMs = Date.now();
    } catch {
      this.erro = true;
    } finally {
      this.carregando = false;
    }
  }
}
