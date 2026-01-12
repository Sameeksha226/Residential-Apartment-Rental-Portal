import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leases } from './leases';

describe('Leases', () => {
  let component: Leases;
  let fixture: ComponentFixture<Leases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
