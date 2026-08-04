import { TestBed } from '@angular/core/testing';
import { TceHttpService } from '@tce/tce-http';

import { environment } from '../../../environments/environment';
import { StatusTempoRealService } from './status-tempo-real.service';

describe('StatusTempoRealService', () => {
  let service: StatusTempoRealService;
  let http: jasmine.SpyObj<TceHttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<TceHttpService>('TceHttpService', ['get$']);
    TestBed.configureTestingModule({
      providers: [StatusTempoRealService, { provide: TceHttpService, useValue: spy }],
    });
    service = TestBed.inject(StatusTempoRealService);
    http = TestBed.inject(TceHttpService) as jasmine.SpyObj<TceHttpService>;
  });

  it('obterStatus deve chamar GET /status sem loading global', () => {
    http.get$.and.resolveTo(null);
    service.obterStatus();
    expect(http.get$).toHaveBeenCalledWith(`${environment.apiUrl}/status`, { showLoading: false });
  });

  it('intervalo de atualização deve refletir o environment (segundos → ms)', () => {
    expect(service.intervaloAtualizacaoMs).toBe((environment.atualizacaoAutomaticaSegundos ?? 60) * 1000);
  });
});
