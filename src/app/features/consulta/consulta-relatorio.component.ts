import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ConsultaRelatorioLimiar } from '../../core/models/relatorio.model';
import { RelatorioUsuarioService } from '../../core/services/relatorio-usuario.service';
import { RelatorioViewComponent } from './relatorio-view.component';

/**
 * Componente inteligente (Smart) da consulta pública do relatório por limiar (F6). Seletor de data,
 * estado inicial (nenhuma consulta ainda), mensagens de ausência (Cenário 2) e de data
 * inválida/futura (Cenário 3), e exibição do relatório com download de PDF (Cenário 6). Acesso
 * público, sem autenticação. Navega de volta ao tempo real.
 */
@Component({
  selector: 'app-consulta-relatorio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RelatorioViewComponent],
  template: `
    <section class="flex flex-col gap-5">
      <div>
        <h1 class="text-[22px] font-bold text-neutral-900 tracking-tight">Relatório de Limiar</h1>
        <p class="text-[13px] text-neutral-500 mt-1">
          Sistemas que ultrapassaram o limiar diário de indisponibilidade. Disponível a partir do dia seguinte (d-1).
        </p>
      </div>

      <div class="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
        <div class="text-sm font-semibold text-neutral-800 mb-4">Selecione uma data para consultar</div>
        <div class="flex gap-3 items-end flex-wrap">
          <div class="flex flex-col gap-1.5">
            <label for="data" class="text-xs font-semibold text-neutral-700">Data de referência</label>
            <input
              id="data"
              type="date"
              [(ngModel)]="data"
              [max]="maxData"
              class="border border-neutral-300 rounded-lg px-3 py-2.5 text-sm text-neutral-800 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            />
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-colors"
            [disabled]="!data || carregando"
            (click)="consultar()"
          >
            <svg class="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {{ carregando ? 'Consultando…' : 'Consultar' }}
          </button>
          <a
            routerLink="/tempo-real"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            <svg class="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao tempo real
          </a>
        </div>
      </div>

      @if (!consulta) {
        <div class="bg-white border border-neutral-200 rounded-xl shadow-sm py-14 px-6 text-center">
          <div class="text-4xl mb-3">📅</div>
          <div class="text-[15px] font-semibold text-neutral-700 mb-1.5">Selecione uma data para consultar</div>
          <div class="text-[13px] text-neutral-400">Os relatórios ficam disponíveis a partir do dia seguinte ao ocorrido.</div>
        </div>
      } @else {
        @switch (consulta.resultado) {
          @case ('Disponivel') {
            @if (consulta.relatorio) {
              <app-relatorio-view [relatorio]="consulta.relatorio" [pdfUrl]="pdfUrl"></app-relatorio-view>
            }
          }
          @case ('SemIndisponibilidade') {
            <div class="bg-white border border-neutral-200 rounded-xl shadow-sm py-14 px-6 text-center">
              <div class="text-4xl mb-3">✅</div>
              <div class="text-[15px] font-semibold text-neutral-700 mb-1.5">Nenhum sistema atingiu o limiar</div>
              <div class="text-[13px] text-neutral-400">
                Nenhum sistema acumulou indisponibilidade acima do limiar na data selecionada.
              </div>
            </div>
          }
          @case ('DataInvalida') {
            <p class="rounded-xl bg-amber-50 text-amber-800 border border-amber-200 px-4 py-3 text-sm">
              Não há relatório disponível para a data selecionada. Os relatórios ficam disponíveis a partir do dia seguinte.
            </p>
          }
        }
      }
    </section>
  `,
})
export class ConsultaRelatorioComponent {
  private readonly service = inject(RelatorioUsuarioService);

  /** Data máxima selecionável = ontem (d-1). */
  readonly maxData = this.formatar(new Date(Date.now() - 86_400_000));

  data = '';
  carregando = false;
  consulta: ConsultaRelatorioLimiar | null = null;
  pdfUrl: string | null = null;

  async consultar(): Promise<void> {
    if (!this.data) return;
    this.carregando = true;
    this.consulta = null;
    this.pdfUrl = null;
    try {
      this.consulta = await this.service.consultar(this.data);
      if (this.consulta?.resultado === 'Disponivel') {
        this.pdfUrl = this.service.urlPdf(this.data);
      }
    } finally {
      this.carregando = false;
    }
  }

  private formatar(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
