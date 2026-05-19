import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Main } from './main';

// Defines the main component test suite.
describe('Main', () => {
  let component: Main;
  let fixture: ComponentFixture<Main>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Main]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Main);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
