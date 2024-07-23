import { TestBed } from '@angular/core/testing';

import { CmsCountryService } from './cms-country.service';

describe('CmsCountryService', () => {
  let service: CmsCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmsCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
