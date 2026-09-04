import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatorioLimiar } from '../../core/models/relatorio.model';
import { iconeSistema } from '../../shared/utils/sistema-icone';

/**
 * Componente de apresentação (OnPush) do relatório por limiar: cabeçalho com código
 * verificador e limiar aplicado, períodos por sistema, total do dia e botão "Baixar PDF".
 * Sem hierarquia (relatório do usuário — F6).
 */
@Component({
  selector: 'app-relatorio-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-4">
      <div
        class="bg-white border border-neutral-200 rounded-xl shadow-sm px-5 py-4 border-b-2 border-b-blue-100 flex items-center justify-between gap-3 flex-wrap"
      >
        <div>
          <div class="text-sm font-bold text-neutral-900">
            Sistemas com indisponibilidade acima do limiar em
            <strong>{{ relatorio.dataReferencia | date: 'dd/MM/yyyy' }}</strong>
          </div>
          <div class="text-xs text-neutral-500 mt-1">
            @if (relatorio.codigoVerificador) {
              🔒 Código verificador: <strong class="text-neutral-700">{{ relatorio.codigoVerificador }}</strong>
            }
            @if (relatorio.limiarMinutos) {
              <span> · Limiar: {{ relatorio.limiarMinutos }} min</span>
            }
          </div>
        </div>
        @if (pdfUrl) {
          <a
            [href]="pdfUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            <svg class="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Baixar PDF
          </a>
        }
      </div>

      @for (sistema of relatorio.sistemas; track sistema.sigla) {
        <div class="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-base">
                {{ icone(sistema.sigla) }}
              </div>
              <div>
                <div class="text-[15px] font-bold text-neutral-900">{{ sistema.nome }}</div>
                <div class="text-[11px] text-neutral-400 font-medium">{{ sistema.sigla }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-[11px] text-neutral-400 font-medium">Total de indisponibilidade</div>
              <div>
                <span class="text-xl font-bold text-red-700">{{ sistema.totalMinutos }}</span>
                <span class="text-xs text-neutral-500 font-medium"> minutos</span>
              </div>
            </div>
          </div>
          <table class="w-full">
            <thead>
              <tr class="border-b border-neutral-100">
                <th class="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Hora de Início
                </th>
                <th class="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Hora de Término
                </th>
                <th class="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Tempo
                </th>
              </tr>
            </thead>
            <tbody>
              @for (p of sistema.periodos; track p.inicio) {
                <tr class="border-b border-neutral-100 last:border-b-0">
                  <td class="px-5 py-3 text-[13px] font-medium text-neutral-900">
                    {{ p.inicio | date: 'dd/MM/yyyy HH:mm' }}
                  </td>
                  <td class="px-5 py-3 text-[13px] font-medium text-neutral-900">
                    {{ p.fim ? (p.fim | date: 'dd/MM/yyyy HH:mm') : '—' }}
                  </td>
                  <td class="px-5 py-3">
                    <span
                      class="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    >
                      ⏱ {{ p.duracaoMinutos != null ? p.duracaoMinutos + ' min' : '—' }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class RelatorioViewComponent {
  @Input({ required: true }) relatorio!: RelatorioLimiar;
  @Input() pdfUrl: string | null = null;

  icone(sigla: string): string {
    return iconeSistema(sigla);
  }
}
