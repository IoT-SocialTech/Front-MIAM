import { TestBed } from '@angular/core/testing';

import { RelativeService } from './relative.service';

describe('RelativeService', () => {
  let service: RelativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
