import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Rastreia requisições HTTP em andamento para exibir o indicador de carregamento global. */
@Injectable({ providedIn: 'root' })
export class HttpLoadingService {
  private readonly requisicoesEmAndamento = new BehaviorSubject<number>(0);

  show(): void {
    this.requisicoesEmAndamento.next(this.requisicoesEmAndamento.value + 1);
  }

  hide(): void {
    this.requisicoesEmAndamento.next(Math.max(0, this.requisicoesEmAndamento.value - 1));
  }

  getLoad(): Observable<boolean> {
    return this.requisicoesEmAndamento.pipe(map((total) => total > 0));
  }
}
