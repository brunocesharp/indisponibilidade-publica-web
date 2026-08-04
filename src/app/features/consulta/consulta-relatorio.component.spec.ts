import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ConsultaRelatorioLimiar } from '../../core/models/relatorio.model';
import { RelatorioUsuarioService } from '../../core/services/relatorio-usuario.service';
import { ConsultaRelatorioComponent } from './consulta-relatorio.component';

describe('ConsultaRelatorioComponent', () => {
  let fixture: ComponentFixture<ConsultaRelatorioComponent>;
  let component: ConsultaRelatorioComponent;
  let service: jasmine.SpyObj<RelatorioUsuarioService>;

  beforeEach(async () => {
    service = jasmine.createSpyObj<RelatorioUsuarioService>('RelatorioUsuarioService', ['consultar', 'urlPdf']);

    await TestBed.configureTestingModule({
      imports: [ConsultaRelatorioComponent],
      providers: [provideRouter([]), { provide: RelatorioUsuarioService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaRelatorioComponent);
    component = fixture.componentInstance;
  });

  it('maxData deve ser ontem (d-1)', () => {
    const ontem = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    expect(component.maxData).toBe(ontem);
  });

  it('resultado Disponivel deve definir a URL do PDF', async () => {
    const consulta: ConsultaRelatorioLimiar = {
      resultado: 'Disponivel',
      relatorio: { dataReferencia: '2026-07-22', limiarMinutos: 120, codigoVerificador: 'X', sistemas: [] },
    };
    service.consultar.and.resolveTo(consulta);
    service.urlPdf.and.returnValue('http://pdf');

    component.data = '2026-07-22';
    await component.consultar();

    expect(component.consulta?.resultado).toBe('Disponivel');
    expect(component.pdfUrl).toBe('http://pdf');
  });

  it('resultado SemIndisponibilidade não define URL do PDF', async () => {
    service.consultar.and.resolveTo({ resultado: 'SemIndisponibilidade', relatorio: null });

    component.data = '2026-07-22';
    await component.consultar();

    expect(component.consulta?.resultado).toBe('SemIndisponibilidade');
    expect(component.pdfUrl).toBeNull();
  });

  it('não consulta quando a data está vazia', async () => {
    component.data = '';
    await component.consultar();
    expect(service.consultar).not.toHaveBeenCalled();
  });
});
