import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';

// Defines the header component test suite.
describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
