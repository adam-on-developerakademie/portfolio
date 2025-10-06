import { TestBed } from '@angular/core/testing';

import { DATA } from '../services/data';

describe('DATA', () => {
  let service: DATA;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DATA);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
