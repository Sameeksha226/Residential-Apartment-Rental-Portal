import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Apartment } from './apartment';

describe('Apartment', () => {
  let component: Apartment;
  let fixture: ComponentFixture<Apartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apartment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Apartment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
