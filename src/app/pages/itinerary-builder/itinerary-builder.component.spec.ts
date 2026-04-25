import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ItineraryBuilderComponent } from './itinerary-builder.component';
import { ToastService } from '../../services/toast.service';

describe('ItineraryBuilderComponent', () => {
  let component: ItineraryBuilderComponent;
  let fixture: ComponentFixture<ItineraryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraryBuilderComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ToastService, useValue: { success: () => {}, error: () => {} } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
