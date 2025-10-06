import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Hero } from './hero/hero';
import { AboutMe } from '../portfolio/about-me/about-me';
//import { SkillSet } from '../skill-set/skill-set';
//import { MyWork } from '../my-work/my-work';

@Component({
  selector: 'app-portfolio',
  imports: [Header, Hero, AboutMe //, SkillSet, MyWork

  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {

}
