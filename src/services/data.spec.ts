import { TestBed } from '@angular/core/testing';

import { DATA } from '../services/data';

// Defines the shared data service test suite.
describe('DATA', () => {
  let service: DATA;

  // Configures the testing injector before each test case.
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DATA);
  });

  // Verifies that the service instance is created successfully.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
