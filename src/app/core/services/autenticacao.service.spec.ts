import { TestBed } from '@angular/core/testing';
import { TceHttpService } from '@tce/tce-http';

import { environment } from '../../../environments/environment';
import { AutenticacaoService } from './autenticacao.service';

describe('AutenticacaoService', () => {
  let service: AutenticacaoService;
  let http: jasmine.SpyObj<TceHttpService>;
  const base = environment.apiUrl;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<TceHttpService>('TceHttpService', ['get$']);
    TestBed.configureTestingModule({
      providers: [AutenticacaoService, { provide: TceHttpService, useValue: spy }],
    });
    service = TestBed.inject(AutenticacaoService);
    http = TestBed.inject(TceHttpService) as jasmine.SpyObj<TceHttpService>;
  });

  it('autenticar deve chamar GET /relatorios/autenticar com o filtro de verificador', () => {
    http.get$.and.resolveTo(null);
    service.autenticar('0000001');
    expect(http.get$).toHaveBeenCalledWith(`${base}/relatorios/autenticar`, {
      filter: { verificador: '0000001' },
    });
  });
});
