import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  myData = inject(DATA);

  // Scrolls to the about-me section from the hero scroll-down control.
  goToAboutMe() {
    const element = document.getElementById('aboutMe');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
