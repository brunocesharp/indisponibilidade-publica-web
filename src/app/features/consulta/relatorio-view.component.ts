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

      @for (sistema of relatorio.sistemas; track sistema.sigla; let primeiro = $first) {
        <details class="group rounded-lg border border-neutral-200 overflow-hidden" [open]="primeiro">
          <summary
            class="flex items-center justify-between gap-3 bg-neutral-50 px-4 py-2 font-semibold text-neutral-800 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden"
          >
            <span>{{ sistema.sigla }} — {{ sistema.nome }}</span>
            <span class="flex items-center gap-2 text-sm font-normal text-neutral-600">
              <span>{{ sistema.totalMinutos }} min</span>
              <svg
                class="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
              </svg>
            </span>
          </summary>
          <table class="w-full text-sm">
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
        </details>
      }
    </div>
  `,
})
export class RelatorioViewComponent {
  @Input({ required: true }) relatorio!: RelatorioLimiar;
  @Input() pdfUrl: string | null = null;
}
