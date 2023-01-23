import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPessoasComponent } from './cadastrar-pessoas.component';

describe('CadastrarPessoasComponent', () => {
  let component: CadastrarPessoasComponent;
  let fixture: ComponentFixture<CadastrarPessoasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrarPessoasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarPessoasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
