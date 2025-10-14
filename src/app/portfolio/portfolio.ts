import { Component } from '@angular/core';
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
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {

    goTo(elementId: HTMLElement) {
    if (elementId) {
      elementId.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
