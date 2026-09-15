import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ConsultaAutenticacao } from '../../core/models/autenticacao.model';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { RelatorioUsuarioService } from '../../core/services/relatorio-usuario.service';

/**
 * Componente inteligente (Smart) da validação de autenticidade do relatório por limiar (F8),
 * rota pública `/autenticar`. Aceita o código verificador digitado manualmente ou lido da
 * querystring `verificador` (link do QR Code — o parâmetro `usuario` é ignorado, RN-8.1).
 * Exibe o resumo do relatório se autêntico (RN-8.3), mensagem genérica de "não localizado"
 * para código inválido/inexistente/tipo A (RN-8.2/RN-8.4), ou de bloqueio temporário após
 * excesso de tentativas (RN-8.7). Acesso público, sem autenticação.
 */
@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="flex flex-col gap-5">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Validação de autenticidade</h1>
          <p class="text-sm text-neutral-500">
            Informe o código verificador impresso no relatório para confirmar sua autenticidade.
          </p>
        </div>
        <a routerLink="/tempo-real" class="px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm font-medium">
          Voltar ao tempo real
        </a>
      </header>

      <div class="rounded-lg border border-neutral-200 bg-white p-5 flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <label for="verificador" class="text-sm font-medium">Código verificador</label>
          <input
            id="verificador"
            type="text"
            [(ngModel)]="verificador"
            class="border border-neutral-300 rounded-md px-3 py-2"
          />
        </div>
        <button
          type="button"
          class="px-4 py-2 rounded-md bg-red-700 text-white text-sm font-medium hover:bg-red-800 disabled:opacity-50"
          [disabled]="!verificador || carregando"
          (click)="autenticar()"
        >
          {{ carregando ? 'Autenticando…' : 'Autenticar' }}
        </button>
      </div>

      @if (bloqueado) {
        <p class="rounded-md bg-amber-50 text-amber-800 px-4 py-3">
          Número de tentativas excedido. Tente novamente em alguns minutos.
        </p>
      } @else if (erro) {
        <p class="text-red-600">Não foi possível validar o código verificador. Tente novamente.</p>
      } @else if (resultado) {
        @switch (resultado.resultado) {
          @case ('Autentico') {
            @if (resultado.relatorio) {
              <div class="rounded-lg border border-neutral-200 bg-white p-5 flex flex-col gap-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p class="rounded-md bg-green-50 text-green-800 px-4 py-3">
                    Relatório autêntico, referente a {{ resultado.relatorio.dataReferencia | date: 'dd/MM/yyyy' }}.
                  </p>
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
                @for (sistema of resultado.relatorio.sistemas; track sistema.sigla) {
                  <div class="rounded-lg border border-neutral-200 overflow-hidden">
                    <div class="bg-neutral-50 px-4 py-2 font-semibold text-neutral-800">
                      {{ sistema.sigla }} — {{ sistema.nome }}
                    </div>
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
                  </div>
                }
              </div>
            }
          }
          @case ('NaoLocalizado') {
            <p class="rounded-md bg-red-50 text-red-800 px-4 py-3">
              Código verificador não localizado. Verifique se foi digitado corretamente.
            </p>
          }
        }
      }
    </section>
  `,
})
export class AutenticacaoComponent implements OnInit {
  private readonly service = inject(AutenticacaoService);
  private readonly relatorioService = inject(RelatorioUsuarioService);
  private readonly route = inject(ActivatedRoute);

  verificador = '';
  carregando = false;
  erro = false;
  bloqueado = false;
  resultado: ConsultaAutenticacao | null = null;
  pdfUrl: string | null = null;

  ngOnInit(): void {
    // Link do QR Code: preenche e autentica automaticamente. O parâmetro "usuario" é ignorado (RN-8.1).
    const verificador = this.route.snapshot.queryParamMap.get('verificador');
    if (verificador) {
      this.verificador = verificador;
      void this.autenticar();
    }
  }

  async autenticar(): Promise<void> {
    if (!this.verificador) return;
    this.carregando = true;
    this.erro = false;
    this.bloqueado = false;
    this.resultado = null;
    this.pdfUrl = null;
    try {
      this.resultado = await this.service.autenticar(this.verificador);
      if (this.resultado.resultado === 'Autentico' && this.resultado.relatorio) {
        this.pdfUrl = this.relatorioService.urlPdf(this.resultado.relatorio.dataReferencia);
        this.baixarPdfAutomaticamente(this.pdfUrl);
      }
    } catch (e: unknown) {
      this.bloqueado = (e as { status?: number })?.status === 429;
      this.erro = !this.bloqueado;
    } finally {
      this.carregando = false;
    }
  }

  /** Dispara o download do PDF assim que o código é validado, sem exigir um segundo clique. */
  private baixarPdfAutomaticamente(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
