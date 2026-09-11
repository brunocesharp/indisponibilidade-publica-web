/** Ícone (emoji) por sigla de sistema, usado nas telas de tempo real e relatório de limiar. */
const ICONES_POR_SIGLA: Record<string, string> = {
  ETCE: '🖥️',
  CPRO: '⚖️',
  EDOF: '📄',
  PJUR: '🏛️',
  SICOM: '📊',
  FISC: '🔎',
  SIACE: '👥',
  PTRA: '💰',
};

const ICONE_PADRAO = '🖥️';

/** Retorna o ícone associado à sigla do sistema, com fallback para siglas não mapeadas. */
export function iconeSistema(sigla: string | null | undefined): string {
  if (!sigla) return ICONE_PADRAO;
  return ICONES_POR_SIGLA[sigla.toUpperCase()] ?? ICONE_PADRAO;
}
