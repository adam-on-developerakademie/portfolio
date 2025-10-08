import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';
import { Header } from "../header/header";
import { Aboutme } from '../aboutme/aboutme';
//import { SkillSet } from '../skill-set/skill-set';
//import { MyWork } from '../my-work/my-work';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, Header, Aboutme //, SkillSet, MyWork

  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {
  myData = inject(DATA);

}
