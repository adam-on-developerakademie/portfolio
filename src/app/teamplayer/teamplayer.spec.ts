import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPlayer } from './teamplayer';

describe('TeamPlayer', () => {
  let component: TeamPlayer;
  let fixture: ComponentFixture<TeamPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
