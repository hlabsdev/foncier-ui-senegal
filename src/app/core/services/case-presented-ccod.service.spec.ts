import { TestBed } from '@angular/core/testing';

import { CasePresentedCcodService } from './case-presented-ccod.service';

describe('CasePresentedCcodService', () => {
  let service: CasePresentedCcodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasePresentedCcodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
