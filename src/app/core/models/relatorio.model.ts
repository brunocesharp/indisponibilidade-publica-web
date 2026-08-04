/** Modelos da consulta do relatório por limiar (usuário). */

/** Desfecho da consulta, alinhado ao enum do backend (serializado como string). */
export type ResultadoConsulta = 'Disponivel' | 'SemIndisponibilidade' | 'DataInvalida';

export interface Periodo {
  inicio: string;
  fim: string | null;
  duracaoMinutos: number | null;
}

export interface RelatorioSistema {
  sigla: string;
  nome: string;
  totalMinutos: number;
  periodos: Periodo[];
}

export interface RelatorioLimiar {
  dataReferencia: string;
  limiarMinutos: number | null;
  codigoVerificador: string | null;
  sistemas: RelatorioSistema[];
}

export interface ConsultaRelatorioLimiar {
  resultado: ResultadoConsulta;
  relatorio: RelatorioLimiar | null;
}
