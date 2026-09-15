import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatorioLimiar } from '../../core/models/relatorio.model';

/**
 * Componente de apresentação (OnPush) do relatório por limiar: períodos por sistema, total do dia
 * e botão "Baixar PDF". Sem hierarquia (relatório do usuário — F6).
 */
@Component({
  selector: 'app-relatorio-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">
            Relatório de {{ relatorio.dataReferencia | date: 'dd/MM/yyyy' }}
          </h2>
          @if (relatorio.limiarMinutos) {
            <p class="text-sm text-neutral-500">Limiar aplicado: {{ relatorio.limiarMinutos }} minutos.</p>
          }
        </div>
        @if (pdfUrl) {
          <a
            [href]="pdfUrl"
            target="_blank"
            rel="noopener"
            class="px-4 py-2 rounded-md bg-red-700 text-white text-sm font-medium hover:bg-red-800"
          >
            Baixar PDF
          </a>
        }
      </div>

      @for (sistema of relatorio.sistemas; track sistema.sigla) {
        <div class="rounded-lg border border-neutral-200 overflow-hidden">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 bg-neutral-50 px-4 py-2 text-left font-semibold text-neutral-800 hover:bg-neutral-100"
            [attr.aria-expanded]="isExpandido(sistema.sigla)"
            [attr.aria-controls]="'sistema-' + sistema.sigla"
            (click)="toggleSistema(sistema.sigla)"
          >
            <span>{{ sistema.sigla }} — {{ sistema.nome }}</span>
            <svg
              class="h-4 w-4 shrink-0 transition-transform"
              [class.rotate-180]="isExpandido(sistema.sigla)"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          @if (isExpandido(sistema.sigla)) {
            <table [id]="'sistema-' + sistema.sigla" class="w-full text-sm">
              <thead class="bg-neutral-100 text-neutral-600">
                <tr>
                  <th class="text-left px-4 py-2">Início</th>
                  <th class="text-left px-4 py-2">Término</th>
                  <th class="text-left px-4 py-2">Tempo</th>
                </tr>
              </thead>
              <tbody>
                @for (p of sistema.periodos; track p.inicio) {
                  <tr class="border-t border-neutral-100">
                    <td class="px-4 py-2">{{ p.inicio | date: 'dd/MM/yyyy HH:mm' }}</td>
                    <td class="px-4 py-2">{{ p.fim ? (p.fim | date: 'dd/MM/yyyy HH:mm') : '—' }}</td>
                    <td class="px-4 py-2">{{ p.duracaoMinutos != null ? p.duracaoMinutos + ' min' : '—' }}</td>
                  </tr>
                }
                <tr class="border-t border-neutral-200 bg-neutral-50 font-semibold">
                  <td class="px-4 py-2" colspan="2">Indisponibilidade total do dia</td>
                  <td class="px-4 py-2 text-red-700">{{ sistema.totalMinutos }} min</td>
                </tr>
              </tbody>
            </table>
          }
        </div>
      }
    </div>
  `,
})
export class RelatorioViewComponent {
  @Input({ required: true }) relatorio!: RelatorioLimiar;
  @Input() pdfUrl: string | null = null;

  private readonly sistemasExpandidos = new Set<string>();

  isExpandido(sigla: string): boolean {
    return this.sistemasExpandidos.has(sigla);
  }

  toggleSistema(sigla: string): void {
    if (!this.sistemasExpandidos.delete(sigla)) {
      this.sistemasExpandidos.add(sigla);
    }
  }
}
