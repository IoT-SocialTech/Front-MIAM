import { TestBed } from '@angular/core/testing';

import { FeingClientService } from './feing-client.service';

describe('FeingClientService', () => {
  let service: FeingClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeingClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
