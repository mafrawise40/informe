import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacaoConsultarComponent } from './informacao-consultar.component';

describe('InformacaoConsultarComponent', () => {
  let component: InformacaoConsultarComponent;
  let fixture: ComponentFixture<InformacaoConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacaoConsultarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacaoConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
