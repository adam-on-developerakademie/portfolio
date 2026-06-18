import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  myData = inject(DATA);

  // Scrolls to the about-me section from the hero scroll-down control.
  goToAboutMe() {
    // Uses the same visual target and offset as the header About me navigation.
    const element = (document.querySelector('app-aboutme .letsWorkTogether')
      ?? document.getElementById('aboutMe')) as HTMLElement | null;
    if (element) {
      const top = window.scrollY + element.getBoundingClientRect().top - 139;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
