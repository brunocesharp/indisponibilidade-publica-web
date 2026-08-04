import { TestBed } from '@angular/core/testing';
import { TceHttpService } from '@tce/tce-http';

import { environment } from '../../../environments/environment';
import { RelatorioUsuarioService } from './relatorio-usuario.service';

describe('RelatorioUsuarioService', () => {
  let service: RelatorioUsuarioService;
  let http: jasmine.SpyObj<TceHttpService>;
  const base = environment.apiUrl;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<TceHttpService>('TceHttpService', ['get$']);
    TestBed.configureTestingModule({
      providers: [RelatorioUsuarioService, { provide: TceHttpService, useValue: spy }],
    });
    service = TestBed.inject(RelatorioUsuarioService);
    http = TestBed.inject(TceHttpService) as jasmine.SpyObj<TceHttpService>;
  });

  it('consultar deve chamar GET /relatorios com o filtro de data', () => {
    http.get$.and.resolveTo(null);
    service.consultar('2026-07-22');
    expect(http.get$).toHaveBeenCalledWith(`${base}/relatorios`, { filter: { data: '2026-07-22' } });
  });

  it('urlPdf deve montar a URL do endpoint de PDF', () => {
    expect(service.urlPdf('2026-07-22')).toBe(`${base}/relatorios/pdf?data=2026-07-22`);
  });
});
