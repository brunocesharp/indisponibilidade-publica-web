import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoadingService } from './loading.service';

export interface HttpGetOptions {
  /** Parâmetros de query string. */
  filter?: Record<string, string | number | boolean | null | undefined>;
  /** Quando false, a requisição não aciona o indicador de carregamento global. */
  showLoading?: boolean;
}

/**
 * Wrapper fino sobre HttpClient para GETs anônimos: monta query params a partir de `filter`,
 * integra com o indicador de carregamento global e nunca rejeita — em erro, loga no console
 * (fora de produção) e resolve `null`, mantendo os componentes livres de tratamento de exceção.
 */
@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly loading = inject(LoadingService);

  async get$<T>(url: string, options: HttpGetOptions = {}): Promise<T | null> {
    const { filter, showLoading = true } = options;
    let params = new HttpParams();
    for (const [chave, valor] of Object.entries(filter ?? {})) {
      if (valor !== null && valor !== undefined) {
        params = params.set(chave, String(valor));
      }
    }

    if (showLoading) this.loading.iniciar();
    try {
      return await firstValueFrom(this.http.get<T>(url, { params }));
    } catch (erro) {
      if (!environment.production) console.error(erro);
      return null;
    } finally {
      if (showLoading) this.loading.finalizar();
    }
  }
}
