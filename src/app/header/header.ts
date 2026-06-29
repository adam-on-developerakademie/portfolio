import { Component, inject, ChangeDetectionStrategy, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnDestroy {

  // Provides shared data service access for header rendering and interactions.
  myData = inject(DATA);
  private readonly router = inject(Router);
  readonly mobileMenuVisible = signal(false);
  readonly mobileMenuPhase = signal<'closed' | 'opening' | 'open' | 'closing'>('closed');
  readonly mobileButtonState = signal<'normal' | 'medium-normal' | 'close' | 'medium-close'>('normal');
  private readonly overlayAnimationMs = 220;
  private overlayTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly sectionSelectors: Record<string, string> = {
    aboutMe: 'app-aboutme .letsWorkTogether',
    skillSet: 'app-skillset .SkillSet',
    myWork: 'app-mywork .myWork'
  };
  private readonly sectionOffsets: Record<string, number> = { aboutMe: -139, skillSet: 0, myWork: 0 };

  // Toggles menu phase and icon state to match the 4-state Figma burger behavior.
  toggleMobileMenu() {
    if (this.mobileMenuPhase() === 'closed') {
      this.openMobileMenu();
      return;
    }
    if (this.mobileMenuPhase() === 'open') {
      this.closeMobileMenu();
    }
  }

  // Starts opening animation and switches icon from normal to medium to close.
  openMobileMenu() {
    this.clearOverlayTimer();
    this.mobileMenuVisible.set(true);
    this.mobileMenuPhase.set('opening');
    this.mobileButtonState.set('medium-normal');
    this.overlayTimer = setTimeout(() => {
      this.mobileMenuPhase.set('open');
      this.mobileButtonState.set('close');
    }, this.overlayAnimationMs);
  }

  // Starts closing animation and switches icon from close to medium to normal.
  closeMobileMenu() {
    this.clearOverlayTimer();
    this.mobileMenuPhase.set('closing');
    this.mobileButtonState.set('medium-close');
    this.overlayTimer = setTimeout(() => {
      this.mobileMenuPhase.set('closed');
      this.mobileMenuVisible.set(false);
      this.mobileButtonState.set('normal');
    }, this.overlayAnimationMs);
  }

  // Returns the current icon path for the 4-state burger button.
  menuButtonIcon() {
    return `ico/burger-${this.mobileButtonState()}.png`;
  }

  // Returns the correct desktop logo variant for the current page background.
  logoSrc() {
    if (this.router.url === '/privacy-policy' || this.router.url === '/legal-notice' || this.router.url === '/social-media-notice') {
      return 'ico/AP.png';
    }
    return 'ico/AP_bgw.png';
  }

  // Scrolls to the hero section and navigates home when the app is on another route.
  goToHero() {
    if (this.router.url !== '/') {
      this.router.navigateByUrl('/').then(() => setTimeout(() => this.scrollToHero(), 0));
    } else {
      this.scrollToHero();
    }
    if (this.mobileMenuPhase() !== 'closed') {
      this.closeMobileMenu();
    }
  }

  // Clears pending overlay timer before starting a new state transition.
  clearOverlayTimer() {
    if (this.overlayTimer) {
      clearTimeout(this.overlayTimer);
      this.overlayTimer = undefined;
    }
  }

  // Resolves the hero section in the DOM and scrolls to its top smoothly.
  private scrollToHero() {
    const hero = document.querySelector('app-main .hero') as HTMLElement | null;
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Releases pending timers when component is destroyed.
  ngOnDestroy() {
    this.clearOverlayTimer();
  }

  // Updates active header state so only the selected section is highlighted.
  setUnderline(section: string) {
    this.myData.DATA.header.forEach(s => s.set = s.name === section);
  }

  // Scrolls to an already resolved element reference.
  goToNew(elementId: HTMLElement) {
    if (elementId) {
      elementId.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Resolves a section id from the DOM and scrolls to it smoothly.
  goToOld(elementId: string) {
    if (elementId === 'aboutMe' && window.innerWidth < 950) {
      this.scrollToHeroBottom();
      return;
    }
    this.scrollToNamedSection(elementId);
  }

  // Scrolls to the bottom of the hero section on mobile for aboutMe link.
  private scrollToHeroBottom() {
    const hero = document.querySelector('app-main .hero') as HTMLElement | null;
    if (hero) {
      const top = window.scrollY + hero.getBoundingClientRect().bottom;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Resolves and scrolls to a named section with custom offset applied.
  private scrollToNamedSection(elementId: string) {
    const sectionSelector = this.sectionSelectors[elementId];
    const element = (sectionSelector
      ? document.querySelector(sectionSelector)
      : document.getElementById(elementId)) as HTMLElement | null;
    if (element) {
      const top = window.scrollY + element.getBoundingClientRect().top + (this.sectionOffsets[elementId] ?? 0);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Navigates to a section and closes the mobile menu when needed.
  navigateToSection(section: string) {
    this.setUnderline(section);
    if (this.router.url !== '/') {
      this.router.navigateByUrl('/').then(() => {
        setTimeout(() => this.goToOld(section), 0);
      });
    } else {
      this.goToOld(section);
    }
    if (this.mobileMenuPhase() !== 'closed') {
      this.closeMobileMenu();
    }
  }

  // Updates current app language from desktop or mobile controls.
  setLanguage(language: 0 | 1) {
    this.myData.DATA.language = language;
    if (this.mobileMenuPhase() !== 'closed') {
      this.closeMobileMenu();
    }
  }
}