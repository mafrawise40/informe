import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioInformacaoComponent } from './relatorio-informacao.component';

describe('RelatorioInformacaoComponent', () => {
  let component: RelatorioInformacaoComponent;
  let fixture: ComponentFixture<RelatorioInformacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioInformacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioInformacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
