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

  // Scrolls from hero to the next visual section, with mobile ending exactly at hero bottom.
  goToAboutMe() {
    if (window.innerWidth < 800) {
      this.scrollToHeroEnd();
      return;
    }

    // Uses the same visual target and offset as the header About me navigation.
    const element = (document.querySelector('app-aboutme .letsWorkTogether')
      ?? document.getElementById('aboutMe')) as HTMLElement | null;
    if (element) {
      const top = window.scrollY + element.getBoundingClientRect().top - 139;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Scrolls to the exact end of the hero section on mobile.
  private scrollToHeroEnd() {
    const hero = document.querySelector('app-main .hero') as HTMLElement | null;
    if (!hero) return;
    const top = window.scrollY + hero.getBoundingClientRect().bottom;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
