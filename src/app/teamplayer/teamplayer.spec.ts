import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPlayer } from './teamplayer';

// Defines the team-player component test suite.
describe('TeamPlayer', () => {
  let component: TeamPlayer;
  let fixture: ComponentFixture<TeamPlayer>;

  // Creates and initializes the component before each test case.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifies that the component instance is created successfully.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
