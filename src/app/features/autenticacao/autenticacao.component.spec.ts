import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { ConsultaAutenticacao } from '../../core/models/autenticacao.model';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { RelatorioUsuarioService } from '../../core/services/relatorio-usuario.service';
import { AutenticacaoComponent } from './autenticacao.component';

describe('AutenticacaoComponent', () => {
  let fixture: ComponentFixture<AutenticacaoComponent>;
  let component: AutenticacaoComponent;
  let service: jasmine.SpyObj<AutenticacaoService>;
  let relatorioService: jasmine.SpyObj<RelatorioUsuarioService>;

  function criar(queryParams: Record<string, string> = {}): void {
    service = jasmine.createSpyObj<AutenticacaoService>('AutenticacaoService', ['autenticar']);
    relatorioService = jasmine.createSpyObj<RelatorioUsuarioService>('RelatorioUsuarioService', ['urlPdf']);
    relatorioService.urlPdf.and.returnValue('http://pdf');

    TestBed.configureTestingModule({
      imports: [AutenticacaoComponent],
      providers: [
        provideRouter([]),
        { provide: AutenticacaoService, useValue: service },
        { provide: RelatorioUsuarioService, useValue: relatorioService },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } } },
      ],
    });

    fixture = TestBed.createComponent(AutenticacaoComponent);
    component = fixture.componentInstance;
  }

  it('preenche e autentica automaticamente a partir da querystring do QR Code, ignorando "usuario"', async () => {
    criar({ verificador: '0000001', usuario: 'ignorado' });
    const consulta: ConsultaAutenticacao = {
      resultado: 'Autentico',
      relatorio: { dataReferencia: '2026-09-10', sistemas: [] },
    };
    service.autenticar.and.resolveTo(consulta);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.verificador).toBe('0000001');
    expect(service.autenticar).toHaveBeenCalledWith('0000001');
    expect(component.resultado?.resultado).toBe('Autentico');
    expect(relatorioService.urlPdf).toHaveBeenCalledWith('2026-09-10');
    expect(component.pdfUrl).toBe('http://pdf');
  });

  it('não autentica quando não há código na querystring nem preenchido manualmente', async () => {
    criar();
    service.autenticar.and.resolveTo({ resultado: 'NaoLocalizado', relatorio: null });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(service.autenticar).not.toHaveBeenCalled();

    await component.autenticar();
    expect(service.autenticar).not.toHaveBeenCalled();
  });

  it('exibe "não localizado" para código inválido/inexistente/tipo A', async () => {
    criar();
    service.autenticar.and.resolveTo({ resultado: 'NaoLocalizado', relatorio: null });

    component.verificador = '9999999';
    await component.autenticar();

    expect(component.resultado?.resultado).toBe('NaoLocalizado');
    expect(component.bloqueado).toBeFalse();
    expect(component.erro).toBeFalse();
  });

  it('exibe mensagem de bloqueio após excesso de tentativas (HTTP 429)', async () => {
    criar();
    service.autenticar.and.rejectWith({ status: 429 });

    component.verificador = '0000001';
    await component.autenticar();

    expect(component.bloqueado).toBeTrue();
    expect(component.erro).toBeFalse();
  });

  it('exibe erro genérico para falhas que não sejam de bloqueio', async () => {
    criar();
    service.autenticar.and.rejectWith({ status: 500 });

    component.verificador = '0000001';
    await component.autenticar();

    expect(component.erro).toBeTrue();
    expect(component.bloqueado).toBeFalse();
  });
});
