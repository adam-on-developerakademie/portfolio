import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-SkillSet',
  imports: [CommonModule],
  templateUrl: './skillset.html',
  styleUrl: './skillset.scss'
})
export class SkillSet {
  myData = inject(DATA);

}
