import { TestBed } from '@angular/core/testing';

import { LOGO } from './logo';

describe('LOGO', () => {
  let service: LOGO;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LOGO);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
