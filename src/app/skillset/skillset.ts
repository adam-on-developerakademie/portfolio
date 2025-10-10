import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';
import { Aboutme } from '../aboutme/aboutme';

@Component({
  selector: 'app-skillset',
  imports: [CommonModule],
  templateUrl: './skillset.html',
  styleUrl: './skillset.scss'
})
export class SkillSet {
  myData = inject(DATA);

  setFocus() {
   
    console.log(Aboutme.letsWorkTogetherButton);
  
  }
}
