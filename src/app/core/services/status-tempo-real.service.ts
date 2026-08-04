import { Injectable, inject } from '@angular/core';
import { TceHttpService } from '@tce/tce-http';

import { environment } from '../../../environments/environment';
import { StatusTempoReal } from '../models/status.model';

/**
 * Serviço de leitura do estado atual das aplicações (página de tempo real).
 * Apenas GET anônimo; o polling de 1 minuto e o refresh manual são orquestrados pelo componente Smart.
 */
@Injectable({ providedIn: 'root' })
export class StatusTempoRealService {
  private readonly http = inject(TceHttpService);
  private readonly baseUrl = environment.apiUrl;

  /** Intervalo de atualização automática (ms), configurável por ambiente. */
  readonly intervaloAtualizacaoMs = (environment.atualizacaoAutomaticaSegundos ?? 60) * 1000;

  obterStatus(): Promise<StatusTempoReal | null> {
    // showLoading=false: o refresh automático não deve piscar o loading global.
    return this.http.get$<StatusTempoReal>(`${this.baseUrl}/status`, { showLoading: false });
  }
}
