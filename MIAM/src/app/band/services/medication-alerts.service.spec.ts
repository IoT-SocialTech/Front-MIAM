import { TestBed } from '@angular/core/testing';

import { MedicationAlertsService } from './medication-alerts.service';

describe('MedicationAlertsService', () => {
  let service: MedicationAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicationAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
