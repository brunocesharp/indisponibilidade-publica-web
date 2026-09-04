import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusServico } from '../../core/models/status.model';
import { iconeSistema } from '../../shared/utils/sistema-icone';

/**
 * Componente de apresentação (OnPush) do estado atual das aplicações: um cartão por serviço,
 * com ícone do sistema, badge de disponível/indisponível e horário da última verificação.
 * Sem lógica de negócio.
 */
@Component({
  selector: 'app-status-tempo-real',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (servicos.length === 0) {
      <p class="text-neutral-500 text-sm">Nenhuma aplicação monitorada no momento.</p>
    } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        @for (s of servicos; track s.sigla) {
          <article
            class="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden border-l-4 hover:shadow-md transition-shadow"
            [class.border-l-emerald-600]="s.disponivel"
            [class.border-l-red-600]="!s.disponivel"
          >
            <div class="px-4 py-4">
              <div class="flex items-start justify-between mb-3.5">
                <div class="flex items-center gap-2.5">
                  <div class="w-[38px] h-[38px] rounded-lg bg-neutral-100 flex items-center justify-center text-[17px]">
                    {{ icone(s.sigla) }}
                  </div>
                  <div>
                    <div class="text-sm font-bold text-neutral-900">{{ s.nome }}</div>
                    <div class="text-[11px] text-neutral-400 font-medium">{{ s.sigla }}</div>
                  </div>
                </div>
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
                  [class.bg-emerald-50]="s.disponivel"
                  [class.text-emerald-700]="s.disponivel"
                  [class.bg-red-50]="!s.disponivel"
                  [class.text-red-700]="!s.disponivel"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    [class.bg-emerald-600]="s.disponivel"
                    [class.bg-red-600]="!s.disponivel"
                  ></span>
                  {{ s.disponivel ? 'Operacional' : 'Indisponível' }}
                </span>
              </div>
              <div class="flex items-center gap-1 border-t border-neutral-100 pt-3 text-[11px] text-neutral-400">
                @if (!s.disponivel && s.indisponivelDesde) {
                  <span>🕓 Indisponível desde {{ s.indisponivelDesde | date: 'dd/MM/yyyy HH:mm' }}</span>
                } @else {
                  <span>🕓 Última verificação: {{ tempoDecorrido() }}</span>
                }
              </div>
            </div>
          </article>
        }
      </div>
    }
  `,
})
export class StatusTempoRealComponent {
  @Input() servicos: StatusServico[] = [];
  @Input() atualizadoEm: string | null = null;
  @Input() agoraMs = Date.now();

  icone(sigla: string): string {
    return iconeSistema(sigla);
  }

  tempoDecorrido(): string {
    if (!this.atualizadoEm) return '—';
    const diffSeg = Math.max(0, Math.round((this.agoraMs - new Date(this.atualizadoEm).getTime()) / 1000));
    return diffSeg < 60 ? `há ${diffSeg}s` : `há ${Math.round(diffSeg / 60)} min`;
  }
}
