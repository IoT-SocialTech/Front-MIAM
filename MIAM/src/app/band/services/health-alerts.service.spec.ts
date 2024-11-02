import { TestBed } from '@angular/core/testing';

import { HealthAlertsService } from './health-alerts.service';

describe('HealthAlertsService', () => {
  let service: HealthAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
