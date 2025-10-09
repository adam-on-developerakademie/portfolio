import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillSet } from './skillset';

describe('SkillSet', () => {
  let component: SkillSet;
  let fixture: ComponentFixture<SkillSet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillSet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillSet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
