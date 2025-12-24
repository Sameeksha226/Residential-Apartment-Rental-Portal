import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDetails } from './unit-details';

describe('UnitDetails', () => {
  let component: UnitDetails;
  let fixture: ComponentFixture<UnitDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
