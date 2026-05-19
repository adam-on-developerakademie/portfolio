import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Portfolio {
  readonly canvasHeight = signal(6587);
  readonly canvasWidth = signal(1440);
  readonly scale = signal(1);

  // Initializes responsive canvas scale at component startup.
  constructor() {
    this.updateScale();
  }

  // Updates the desktop canvas scale to fit narrower viewports without clipping.
  updateScale() {
    const isMobileViewport = window.innerWidth < 1000;
    if (isMobileViewport) {
      const mobileScale = Math.min(1, window.innerWidth / 390);
      this.canvasWidth.set(390);
      this.canvasHeight.set(7120);
      this.scale.set(mobileScale);
      return;
    }
    this.canvasWidth.set(1440);
    this.canvasHeight.set(6587);
    this.scale.set(Math.min(1, window.innerWidth / 1440));
  }
}
