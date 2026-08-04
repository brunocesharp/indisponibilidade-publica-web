import { Injectable, inject } from '@angular/core';
import { TceHttpService } from '@tce/tce-http';

import { environment } from '../../../environments/environment';
import { ConsultaRelatorioLimiar } from '../models/relatorio.model';

/**
 * Serviço de consulta pública do relatório por limiar (usuário). GET anônimo.
 * O download do PDF usa a URL direta do endpoint (acesso público, sem token).
 */
@Injectable({ providedIn: 'root' })
export class RelatorioUsuarioService {
  private readonly http = inject(TceHttpService);
  private readonly baseUrl = environment.apiUrl;

  /** Consulta o relatório por limiar de uma data (formato yyyy-MM-dd). */
  consultar(data: string): Promise<ConsultaRelatorioLimiar | null> {
    return this.http.get$<ConsultaRelatorioLimiar>(`${this.baseUrl}/relatorios`, { filter: { data } });
  }

  /** URL de download do PDF do relatório d-1 concluído. */
  urlPdf(data: string): string {
    return `${this.baseUrl}/relatorios/pdf?data=${encodeURIComponent(data)}`;
  }
}
