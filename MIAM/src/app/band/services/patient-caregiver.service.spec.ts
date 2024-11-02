import { TestBed } from '@angular/core/testing';

import { PatientCaregiverService } from './patient-caregiver.service';

describe('PatientCaregiverService', () => {
  let service: PatientCaregiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientCaregiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
