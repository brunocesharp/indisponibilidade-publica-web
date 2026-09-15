import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ConsultaRelatorioLimiar } from '../../core/models/relatorio.model';
import { RelatorioUsuarioService } from '../../core/services/relatorio-usuario.service';
import { RelatorioViewComponent } from './relatorio-view.component';

/**
 * Componente inteligente (Smart) da consulta pública do relatório por limiar (F6). Seletor de data,
 * mensagens de ausência (Cenário 2) e de data inválida/futura (Cenário 3), e exibição do relatório
 * com download de PDF (Cenário 6). Acesso público, sem autenticação. Navega de volta ao tempo real.
 */
@Component({
  selector: 'app-consulta-relatorio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RelatorioViewComponent],
  template: `
    <section class="flex flex-col gap-5">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Consulta de relatórios</h1>
          <p class="text-sm text-neutral-500">
            Relatório por limiar de indisponibilidade, disponível a partir do dia seguinte (d-1).
          </p>
        </div>
        <a routerLink="/tempo-real" class="px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm font-medium">
          Voltar ao tempo real
        </a>
      </header>

      <div class="rounded-lg border border-neutral-200 bg-white p-5 flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <label for="data" class="text-sm font-medium">Data do relatório</label>
          <input
            id="data"
            type="date"
            [(ngModel)]="data"
            [max]="maxData"
            class="border border-neutral-300 rounded-md px-3 py-2"
          />
        </div>
        <button
          type="button"
          class="px-4 py-2 rounded-md bg-red-700 text-white text-sm font-medium hover:bg-red-800 disabled:opacity-50"
          [disabled]="!data || carregando"
          (click)="consultar()"
        >
          {{ carregando ? 'Consultando…' : 'Consultar' }}
        </button>
      </div>

      @if (erro) {
        <p class="text-red-600">Não foi possível consultar o relatório. Tente novamente.</p>
      } @else if (consulta) {
        @switch (consulta.resultado) {
          @case ('Disponivel') {
            @if (consulta.relatorio) {
              <app-relatorio-view [relatorio]="consulta.relatorio" [pdfUrl]="pdfUrl"></app-relatorio-view>
            }
          }
          @case ('SemIndisponibilidade') {
            <p class="rounded-md bg-green-50 text-green-800 px-4 py-3">
              Não houve indisponibilidades registradas na data consultada.
            </p>
          }
          @case ('DataInvalida') {
            <p class="rounded-md bg-amber-50 text-amber-800 px-4 py-3">
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
  erro = false;
  consulta: ConsultaRelatorioLimiar | null = null;
  pdfUrl: string | null = null;

  async consultar(): Promise<void> {
    if (!this.data) return;
    this.carregando = true;
    this.erro = false;
    this.consulta = null;
    this.pdfUrl = null;
    try {
      this.consulta = await this.service.consultar(this.data);
      if (this.consulta.resultado === 'Disponivel') {
        this.pdfUrl = this.service.urlPdf(this.data);
      }
    } catch {
      this.erro = true;
    } finally {
      this.carregando = false;
    }
  }

  private formatar(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
