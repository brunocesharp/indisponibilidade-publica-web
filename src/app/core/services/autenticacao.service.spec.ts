import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { AutenticacaoService } from './autenticacao.service';
import { HttpApiService } from './http-api.service';

describe('AutenticacaoService', () => {
  let service: AutenticacaoService;
  let http: jasmine.SpyObj<HttpApiService>;
  const base = environment.apiUrl;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<HttpApiService>('HttpApiService', ['get$']);
    TestBed.configureTestingModule({
      providers: [AutenticacaoService, { provide: HttpApiService, useValue: spy }],
    });
    service = TestBed.inject(AutenticacaoService);
    http = TestBed.inject(HttpApiService) as jasmine.SpyObj<HttpApiService>;
  });

  it('autenticar deve chamar GET /relatorios/autenticar com o filtro de verificador', () => {
    http.get$.and.resolveTo(null);
    service.autenticar('0000001');
    expect(http.get$).toHaveBeenCalledWith(`${base}/relatorios/autenticar`, {
      filter: { verificador: '0000001' },
    });
  });
});
