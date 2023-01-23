import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPessoasComponent } from './consultar-pessoas.component';

describe('ConsultarPessoasComponent', () => {
  let component: ConsultarPessoasComponent;
  let fixture: ComponentFixture<ConsultarPessoasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarPessoasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarPessoasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
