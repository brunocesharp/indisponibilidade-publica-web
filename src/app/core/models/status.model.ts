/** Modelos do estado atual das aplicações (página de tempo real). */

export interface StatusServico {
  sigla: string;
  nome: string;
  disponivel: boolean;
  /** Início do período de indisponibilidade em andamento (ISO), quando indisponível. */
  indisponivelDesde: string | null;
}

export interface StatusTempoReal {
  /** Momento em que o estado foi lido do banco (ISO). */
  atualizadoEm: string;
  servicos: StatusServico[];
}
