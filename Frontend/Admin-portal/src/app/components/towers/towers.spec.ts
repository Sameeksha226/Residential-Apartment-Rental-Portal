import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Towers } from './towers';

describe('Towers', () => {
  let component: Towers;
  let fixture: ComponentFixture<Towers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Towers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Towers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
