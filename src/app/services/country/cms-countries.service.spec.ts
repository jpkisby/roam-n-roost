import { TestBed } from '@angular/core/testing';

import { CmsCountriesService } from './cms-countries.service';

describe('CmsCountriesService', () => {
  let service: CmsCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmsCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
