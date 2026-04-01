import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingAssignmentComponent } from './pricing-assignment.component';

describe('PricingAssignmentComponent', () => {
  let component: PricingAssignmentComponent;
  let fixture: ComponentFixture<PricingAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
