import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contact } from './contact';

// Defines the contact component test suite.
describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
