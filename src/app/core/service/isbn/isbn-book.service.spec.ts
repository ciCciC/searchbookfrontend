import { TestBed } from '@angular/core/testing';

import { IsbnBookService } from './isbn-book.service';

describe('BookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsbnBookService = TestBed.get(IsbnBookService);
    expect(service).toBeTruthy();
  });
});
