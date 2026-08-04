import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusServico } from '../../core/models/status.model';

/**
 * Componente de apresentação (OnPush) do estado atual das aplicações: um cartão por serviço,
 * com badge de disponível/indisponível e, quando em queda, desde quando. Sem lógica de negócio.
 */
@Component({
  selector: 'app-status-tempo-real',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (servicos.length === 0) {
      <p class="text-neutral-500">Nenhuma aplicação monitorada no momento.</p>
    } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (s of servicos; track s.sigla) {
          <article
            class="rounded-lg border border-neutral-200 bg-white shadow-sm border-l-4"
            [class.border-l-green-500]="s.disponivel"
            [class.border-l-red-500]="!s.disponivel"
          >
            <div class="p-4">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <div class="font-bold text-neutral-900">{{ s.nome }}</div>
                  <div class="text-xs text-neutral-400">{{ s.sigla }}</div>
                </div>
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  [class.bg-green-100]="s.disponivel"
                  [class.text-green-700]="s.disponivel"
                  [class.bg-red-100]="!s.disponivel"
                  [class.text-red-700]="!s.disponivel"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    [class.bg-green-600]="s.disponivel"
                    [class.bg-red-600]="!s.disponivel"
                  ></span>
                  {{ s.disponivel ? 'Operacional' : 'Indisponível' }}
                </span>
              </div>
              <div class="border-t border-neutral-100 pt-3 text-xs text-neutral-500">
                @if (!s.disponivel && s.indisponivelDesde) {
                  Indisponível desde {{ s.indisponivelDesde | date: 'dd/MM/yyyy HH:mm' }}
                } @else {
                  Sistema operando normalmente
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
}
