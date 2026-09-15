import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AutenticacaoRelatorio } from '../models/autenticacao.model';
import { HttpApiService } from './http-api.service';

/**
 * Serviço de validação de autenticidade do relatório por limiar (F8). GET anônimo por código
 * verificador — rota `/autenticar`, sujeita a rate limiting no backend (RN-8.7). Código
 * inválido/inexistente/tipo A responde 404; excesso de tentativas responde 429.
 */
@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly http = inject(HttpApiService);
  private readonly baseUrl = environment.apiUrl;

  /** Consulta o relatório de limiar autenticável pelo código verificador informado. */
  autenticar(verificador: string): Promise<AutenticacaoRelatorio> {
    return this.http.get$<AutenticacaoRelatorio>(`${this.baseUrl}/relatorios/autenticar`, {
      filter: { verificador },
    });
  }
}
