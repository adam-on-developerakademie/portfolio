import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Main } from '../main/main';
import { Aboutme } from '../aboutme/aboutme';
import { SkillSet } from '../skillset/skillset';
import { MyWork } from '../mywork/mywork';
import { TeamPlayer } from '../teamplayer/teamplayer';  


@Component({
  selector: 'app-portfolio',
  imports: [ Header, Main, Aboutme, SkillSet, MyWork, TeamPlayer],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {

}
