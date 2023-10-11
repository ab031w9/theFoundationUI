import { TestBed } from '@angular/core/testing';

import { AtmDataService } from './atm-data.service';

describe('AtmDataService', () => {
  let service: AtmDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtmDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
