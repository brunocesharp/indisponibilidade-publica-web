import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

/** Controla o indicador de carregamento global (requisições com showLoading !== false). */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly contador$ = new BehaviorSubject<number>(0);

  iniciar(): void {
    this.contador$.next(this.contador$.value + 1);
  }

  finalizar(): void {
    this.contador$.next(Math.max(0, this.contador$.value - 1));
  }

  getLoad(): Observable<boolean> {
    return this.contador$.pipe(map((n) => n > 0));
  }
}
