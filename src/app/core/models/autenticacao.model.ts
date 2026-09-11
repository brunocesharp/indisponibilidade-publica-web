/** Modelos da validação de autenticidade do relatório por limiar (F8, rota pública `/autenticar`). */

import { RelatorioSistema } from './relatorio.model';

/** Desfecho da autenticação, alinhado ao enum do backend (serializado como string). */
export type ResultadoAutenticacao = 'Autentico' | 'NaoLocalizado';

/** Espelha `RelatorioAutenticacaoDto`: sistemas do relatório de limiar e indisponibilidade total do dia. */
export interface AutenticacaoRelatorio {
  dataReferencia: string;
  sistemas: RelatorioSistema[];
}

export interface ConsultaAutenticacao {
  resultado: ResultadoAutenticacao;
  relatorio: AutenticacaoRelatorio | null;
}
