import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ItineraryService } from './itinerary.service';

describe('ItineraryService', () => {
  let service: ItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ItineraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
