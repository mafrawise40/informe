import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoVeiculoDesfechoComponent } from './dialogo-veiculo-desfecho.component';

describe('DialogoVeiculoDesfechoComponent', () => {
  let component: DialogoVeiculoDesfechoComponent;
  let fixture: ComponentFixture<DialogoVeiculoDesfechoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoVeiculoDesfechoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoVeiculoDesfechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
