import { Component, signal } from '@angular/core';
import { Header } from "../header/header";
import { Main } from '../main/main';
import { Aboutme } from '../aboutme/aboutme';
import { SkillSet } from '../skillset/skillset';
import { MyWork } from '../mywork/mywork';
import { TeamPlayer } from '../teamplayer/teamplayer';  
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';


@Component({
  selector: 'app-portfolio',
  imports: [ Header, Main, Aboutme, SkillSet, MyWork, TeamPlayer, Contact, Footer],
  host: {
    '(window:resize)': 'updateScale()'
  },
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {
  protected readonly canvasHeight = 6587;
  readonly scale = signal(1);

  // Initializes responsive canvas scale at component startup.
  constructor() {
    this.updateScale();
  }

  // Updates the desktop canvas scale to fit narrower viewports without clipping.
  updateScale() {
    this.scale.set(Math.min(1, window.innerWidth / 1440));
  }
}
