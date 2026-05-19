import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

// Defines the footer component test suite.
describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
