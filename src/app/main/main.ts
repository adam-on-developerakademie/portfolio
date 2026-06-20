import { Component, inject, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements AfterViewInit {
  myData = inject(DATA);
  private ngZone = inject(NgZone);

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

  // Applies mobile overlap protection after the view is ready.
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.positionMeElement();
      window.addEventListener('resize', () => this.positionMeElement());
    });
  }

  // Keeps the old mobile layout and only moves .me if it overlaps .profession.
  private positionMeElement() {
    if (window.innerWidth > 799) {
      this.clearMeInlinePosition();
      return;
    }
    const profession = document.querySelector('app-main .hero .profession') as HTMLElement | null;
    const me = document.querySelector('app-main .hero .me') as HTMLElement | null;
    if (!profession || !me) {
      return;
    }
    this.clearMeInlinePosition();
    const minTop = profession.offsetTop + profession.offsetHeight + 20;
    if (me.offsetTop >= minTop) {
      return;
    }
    me.style.top = `${minTop}px`;
    me.style.bottom = 'auto';
  }

  // Resets inline position so stylesheet controls the default layout.
  private clearMeInlinePosition() {
    const me = document.querySelector('app-main .hero .me') as HTMLElement | null;
    if (!me) {
      return;
    }
    me.style.top = '';
    me.style.bottom = '';
  }
}
