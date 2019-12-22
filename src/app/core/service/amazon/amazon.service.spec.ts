import { TestBed } from '@angular/core/testing';

import { AmazonService } from './amazon.service';

describe('AmazonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmazonService = TestBed.get(AmazonService);
    expect(service).toBeTruthy();
  });
});
