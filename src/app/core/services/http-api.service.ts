import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { HttpLoadingService } from './http-loading.service';

export interface HttpGetOptions {
  /** Parâmetros enviados como query string da requisição. */
  filter?: Record<string, string | number | boolean | null | undefined>;
  /** Quando `false`, a requisição não aciona o indicador de carregamento global. */
  showLoading?: boolean;
}

/** Cliente HTTP fino usado pelos serviços públicos (somente GET anônimo, sem autenticação). */
@Injectable({ providedIn: 'root' })
export class HttpApiService {
  private readonly http = inject(HttpClient);
  private readonly loading = inject(HttpLoadingService);

  get$<T>(url: string, options?: HttpGetOptions): Promise<T> {
    const mostrarLoading = options?.showLoading !== false;
    let params = new HttpParams();
    for (const [chave, valor] of Object.entries(options?.filter ?? {})) {
      if (valor !== null && valor !== undefined) {
        params = params.set(chave, String(valor));
      }
    }

    if (mostrarLoading) {
      this.loading.show();
    }

    return firstValueFrom(
      this.http.get<T>(url, { params }).pipe(
        finalize(() => {
          if (mostrarLoading) {
            this.loading.hide();
          }
        }),
      ),
    );
  }
}
