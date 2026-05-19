import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aboutme } from './aboutme';

// Defines the about-me component test suite.
describe('Aboutme', () => {
  let component: Aboutme;
  let fixture: ComponentFixture<Aboutme>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aboutme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aboutme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
