import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { StatusTempoRealService } from './status-tempo-real.service';

describe('StatusTempoRealService', () => {
  let service: StatusTempoRealService;
  let http: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<HttpService>('HttpService', ['get$']);
    TestBed.configureTestingModule({
      providers: [StatusTempoRealService, { provide: HttpService, useValue: spy }],
    });
    service = TestBed.inject(StatusTempoRealService);
    http = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
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
