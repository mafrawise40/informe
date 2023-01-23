import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelCaraterGeralComponent } from './painel-carater-geral.component';

describe('PainelCaraterGeralComponent', () => {
  let component: PainelCaraterGeralComponent;
  let fixture: ComponentFixture<PainelCaraterGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelCaraterGeralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelCaraterGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
