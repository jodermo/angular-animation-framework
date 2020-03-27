import { TestBed } from '@angular/core/testing';

import { ThreeVrService } from './three-vr.service';

describe('ThreeVrService', () => {
  let service: ThreeVrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeVrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
