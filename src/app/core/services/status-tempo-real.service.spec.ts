import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { StatusTempoRealService } from './status-tempo-real.service';
import { HttpApiService } from './http-api.service';

describe('StatusTempoRealService', () => {
  let service: StatusTempoRealService;
  let http: jasmine.SpyObj<HttpApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<HttpApiService>('HttpApiService', ['get$']);
    TestBed.configureTestingModule({
      providers: [StatusTempoRealService, { provide: HttpApiService, useValue: spy }],
    });
    service = TestBed.inject(StatusTempoRealService);
    http = TestBed.inject(HttpApiService) as jasmine.SpyObj<HttpApiService>;
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
