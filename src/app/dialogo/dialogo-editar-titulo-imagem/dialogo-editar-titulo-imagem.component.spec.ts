import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEditarTituloImagemComponent } from './dialogo-editar-titulo-imagem.component';

describe('DialogoEditarTituloImagemComponent', () => {
  let component: DialogoEditarTituloImagemComponent;
  let fixture: ComponentFixture<DialogoEditarTituloImagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoEditarTituloImagemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoEditarTituloImagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
