import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-skillset',
  imports: [CommonModule],
  templateUrl: './skillset.html',
  styleUrl: './skillset.scss'
})
export class SkillSet {
  myData = inject(DATA);

  // Reserved for future skill-card interactions.
  setFocus() {
    return;
  }
}
