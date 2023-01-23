import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarVeiculosComponent } from './consultar-veiculos.component';

describe('ConsultarVeiculosComponent', () => {
  let component: ConsultarVeiculosComponent;
  let fixture: ComponentFixture<ConsultarVeiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarVeiculosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarVeiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
