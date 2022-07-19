import { TestBed } from '@angular/core/testing';

import { RightOwnerService } from './right-owner.service';

describe('RightOwnerService', () => {
  let service: RightOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RightOwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
