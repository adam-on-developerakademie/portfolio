import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWork } from './mywork';

// Defines the my-work component test suite.
describe('MyWork', () => {
  let component: MyWork;
  let fixture: ComponentFixture<MyWork>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
