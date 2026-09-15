import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AutenticacaoRelatorio } from '../../core/models/autenticacao.model';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { RelatorioUsuarioService } from '../../core/services/relatorio-usuario.service';

/**
 * Componente inteligente (Smart) da validação de autenticidade do relatório por limiar (F8),
 * rota pública `/autenticar`. Aceita o código verificador digitado manualmente ou lido da
 * querystring `verificador` (link do QR Code — o parâmetro `usuario` é ignorado, RN-8.1).
 * Exibe o resumo do relatório se autêntico (RN-8.3, HTTP 200), mensagem genérica de "não
 * localizado" para código inválido/inexistente/tipo A (RN-8.2/RN-8.4, HTTP 404), ou de bloqueio
 * temporário após excesso de tentativas (RN-8.7, HTTP 429). Acesso público, sem autenticação.
 */
@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './autenticacao.component.html',
})
export class AutenticacaoComponent implements OnInit {
  private readonly service = inject(AutenticacaoService);
  private readonly relatorioService = inject(RelatorioUsuarioService);
  private readonly route = inject(ActivatedRoute);

  verificador = '';
  carregando = false;
  erro = false;
  bloqueado = false;
  naoLocalizado = false;
  resultado: AutenticacaoRelatorio | null = null;
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
    this.naoLocalizado = false;
    this.resultado = null;
    this.pdfUrl = null;
    try {
      this.resultado = await this.service.autenticar(this.verificador);
      this.pdfUrl = this.relatorioService.urlPdf(this.resultado.dataReferencia);
      this.baixarPdfAutomaticamente(this.pdfUrl);
    } catch (e: unknown) {
      const status = (e as { status?: number })?.status;
      this.bloqueado = status === 429;
      this.naoLocalizado = status === 404;
      this.erro = !this.bloqueado && !this.naoLocalizado;
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
