import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tabela02Component } from './tabela02.component';

describe('Tabela02Component', () => {
  let component: Tabela02Component;
  let fixture: ComponentFixture<Tabela02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tabela02Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tabela02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
