import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyReviewComponent } from './agency-review.component';

describe('AgencyReviewComponent', () => {
  let component: AgencyReviewComponent;
  let fixture: ComponentFixture<AgencyReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
