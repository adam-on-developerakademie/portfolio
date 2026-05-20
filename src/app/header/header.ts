import { Component, inject, ChangeDetectionStrategy, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  readonly mobileMenuVisible = signal(false);
  readonly mobileMenuPhase = signal<'closed' | 'opening' | 'open' | 'closing'>('closed');
  readonly mobileButtonState = signal<'normal' | 'medium-normal' | 'close' | 'medium-close'>('normal');
  private readonly overlayAnimationMs = 220;
  private overlayTimer: ReturnType<typeof setTimeout> | undefined;

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

  // Clears pending overlay timer before starting a new state transition.
  clearOverlayTimer() {
    if (this.overlayTimer) {
      clearTimeout(this.overlayTimer);
      this.overlayTimer = undefined;
    }
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
    const element: HTMLElement = document.getElementById(elementId) as HTMLElement;
    element.id = elementId;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Navigates to a section and closes the mobile menu when needed.
  navigateToSection(section: string) {
    this.setUnderline(section);
    this.goToOld(section);
    this.closeMobileMenu();
  }

  // Updates current app language from desktop or mobile controls.
  setLanguage(language: 0 | 1) {
    this.myData.DATA.language = language;
  }
}