import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  // Provides access to shared application data service.
  myData = inject(DATA);
  private readonly router = inject(Router);

  // Navigates to the hero section and returns to the home route when needed.
  goToHero() {
    if (this.router.url !== '/') {
      this.router.navigateByUrl('/').then(() => setTimeout(() => this.scrollToHero(), 0));
      return;
    }
    this.scrollToHero();
  }

  // Resolves the hero element in the DOM and scrolls it into view smoothly.
  private scrollToHero() {
    const hero = document.querySelector('app-main .hero') as HTMLElement | null;
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
