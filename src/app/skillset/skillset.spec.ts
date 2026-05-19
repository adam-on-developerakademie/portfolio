import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillSet } from './skillset';

// Defines the skill-set component test suite.
describe('SkillSet', () => {
  let component: SkillSet;
  let fixture: ComponentFixture<SkillSet>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillSet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillSet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
