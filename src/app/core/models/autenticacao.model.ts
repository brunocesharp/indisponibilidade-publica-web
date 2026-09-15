/** Modelos da validação de autenticidade do relatório por limiar (F8, rota pública `/autenticar`). */

import { RelatorioSistema } from './relatorio.model';

/**
 * Espelha `RelatorioAutenticacaoDto`: corpo retornado por GET /relatorios/autenticar quando o
 * código verificador é autêntico (HTTP 200). Código inválido/inexistente/tipo A responde 404;
 * excesso de tentativas responde 429 (RN-8.7) — sem envelope de resultado no corpo.
 */
export interface AutenticacaoRelatorio {
  dataReferencia: string;
  sistemas: RelatorioSistema[];
}
