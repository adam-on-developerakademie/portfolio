import { Component, signal, computed, ChangeDetectionStrategy, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from "../header/header";
import { Main } from '../main/main';
import { Aboutme } from '../aboutme/aboutme';
import { SkillSet } from '../skillset/skillset';
import { MyWork } from '../mywork/mywork';
import { TeamPlayer } from '../teamplayer/teamplayer';  
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';
import { PrivacyPolicy } from '../privacy-policy/privacy-policy';
import { LegalNotice } from '../legal-notice/legal-notice';
import { SocialMediaNotice } from '../social-media-notice/social-media-notice';


@Component({
  selector: 'app-portfolio',
  imports: [Header, Main, Aboutme, SkillSet, MyWork, TeamPlayer, Contact, Footer, PrivacyPolicy, LegalNotice, SocialMediaNotice],
  host: {
    '(window:resize)': 'updateScale()'
  },
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Portfolio implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  readonly canvasHeight = signal(6777);
  readonly canvasWidth = signal(1440);
  readonly scale = signal(1);
  readonly overlayPage = signal<'none' | 'privacy' | 'legal' | 'social'>('none');
  readonly isOverlayOpen = computed(() => this.overlayPage() !== 'none');
  private overlayResizeObserver: ResizeObserver | null = null;
  private observedOverlayHeader: HTMLElement | null = null;
  private observedOverlayPanel: HTMLElement | null = null;
  private observedOverlayFooter: HTMLElement | null = null;
  private readonly mobileSectionGap = 24;
  private mobileGaps: {
    heroToAbout: number;
    aboutToSkill: number;
    skillToWork: number;
    workToTeam: number;
    teamToContact: number;
    contactToFooter: number;
  } | null = null;

  // Initializes responsive canvas scale at component startup.
  constructor() {
    this.syncOverlayFromUrl();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncOverlayFromUrl();
        if (this.isOverlayOpen()) {
          this.scrollToTop();
        }
        this.updateScale();
        this.syncOverlayObservation();
      });
    this.updateScale();
  }

  // Initializes runtime mobile offsets after first render.
  ngAfterViewInit() {
    if (this.isOverlayOpen()) {
      this.syncOverlayObservation();
      this.syncOverlayHeight();
      return;
    }
    if (!this.isOverlayOpen()) {
      this.syncMobileOffsets();
    }
  }

  // Cleans up runtime observers when the component is destroyed.
  ngOnDestroy() {
    this.stopOverlayObserver();
  }

  // Updates the desktop canvas scale to fit narrower viewports without clipping.
  updateScale() {
    if (this.isOverlayOpen()) {
      const isMobileViewport = window.innerWidth < 1000;
      if (isMobileViewport) {
        const mobileScale = Math.min(1, window.innerWidth / 390);
        this.canvasWidth.set(390);
        this.scale.set(mobileScale);
      } else {
        this.canvasWidth.set(1440);
        this.scale.set(Math.min(1, window.innerWidth / 1440));
      }
      this.canvasHeight.set(1200);
      this.syncOverlayHeight();
      this.clearMobileOffsetVars();
      return;
    }
    const isMobileViewport = window.innerWidth < 1000;
    if (isMobileViewport) {
      const mobileScale = Math.min(1, window.innerWidth / 390);
      this.canvasWidth.set(390);
      this.canvasHeight.set(7120);
      this.scale.set(mobileScale);
      this.syncMobileOffsets();
      return;
    }
    this.canvasWidth.set(1440);
    this.canvasHeight.set(6777);
    this.scale.set(Math.min(1, window.innerWidth / 1440));
    this.clearMobileOffsetVars();
  }

  // Updates mobile section top offsets from current rendered section heights.
  private syncMobileOffsets() {
    requestAnimationFrame(() => {
      if (window.innerWidth >= 1000) {
        return;
      }
      this.applyMeasuredMobileOffsets();
      requestAnimationFrame(() => {
        if (window.innerWidth < 1000) {
          this.applyMeasuredMobileOffsets();
        }
      });
    });
  }

  // Measures all mobile sections and writes dynamic top vars while preserving current gaps.
  private applyMeasuredMobileOffsets() {
    const hero = this.getElement('app-main .hero');
    const about = this.getElement('app-aboutme .letsWorkTogether');
    const skill = this.getElement('app-skillset .SkillSet');
    const myWork = this.getElement('app-mywork .myWork');
    const team = this.getElement('app-teamplayer .teamPlayer');
    const contact = this.getElement('app-contact .contact');
    const footer = this.getElement('app-footer .footer');
    if (!hero || !about || !skill || !myWork || !team || !contact || !footer) {
      return;
    }
    if (!this.mobileGaps) {
      this.mobileGaps = this.captureMobileGaps(hero, about, skill, myWork, team, contact, footer);
    }
    document.documentElement.style.setProperty('--teamplayer-top', `${team.offsetTop}px`);
    document.documentElement.style.setProperty('--teamplayer-height', `${team.offsetHeight}px`);
    const gaps = this.mobileGaps;
    const aboutTop = hero.offsetTop + hero.offsetHeight + gaps.heroToAbout;
    const skillTop = aboutTop + about.offsetHeight + gaps.aboutToSkill;
    const workTop = skillTop + skill.offsetHeight + gaps.skillToWork;
    const teamTop = workTop + myWork.offsetHeight;
    const fixedTeamToContactGap = 48;
    const fixedContactToFooterGap = 48;
    const contactTop = teamTop + team.offsetHeight + fixedTeamToContactGap;
    const footerTop = contactTop + contact.offsetHeight + fixedContactToFooterGap;
    document.documentElement.style.setProperty('--aboutme-mobile-top', `${aboutTop}px`);
    document.documentElement.style.setProperty('--skillset-mobile-top', `${skillTop}px`);
    document.documentElement.style.setProperty('--mywork-mobile-top', `${workTop}px`);
    document.documentElement.style.setProperty('--teamplayer-mobile-top', `${teamTop}px`);
    document.documentElement.style.setProperty('--contact-mobile-top', `${contactTop}px`);
    document.documentElement.style.setProperty('--footer-mobile-top', `${footerTop}px`);
    this.canvasHeight.set(footerTop + footer.offsetHeight + this.mobileSectionGap);
  }

  // Captures current visual gaps once and keeps them while section heights change.
  private captureMobileGaps(
    hero: HTMLElement,
    about: HTMLElement,
    skill: HTMLElement,
    myWork: HTMLElement,
    team: HTMLElement,
    contact: HTMLElement,
    footer: HTMLElement
  ) {
    // Keeps mobile gaps in a realistic range to avoid runaway offsets.
    const sanitizeGap = (value: number, fallback: number) => {
      if (!Number.isFinite(value)) return fallback;
      if (value < 0) return fallback;
      if (value > 320) return fallback;
      return value;
    };

    const heroToAbout = about.offsetTop - (hero.offsetTop + hero.offsetHeight);
    const aboutToSkill = skill.offsetTop - (about.offsetTop + about.offsetHeight);
    const skillToWork = myWork.offsetTop - (skill.offsetTop + skill.offsetHeight);
    const workToTeam = team.offsetTop - (myWork.offsetTop + myWork.offsetHeight);
    const teamToContact = contact.offsetTop - (team.offsetTop + team.offsetHeight);
    const contactToFooter = footer.offsetTop - (contact.offsetTop + contact.offsetHeight);

    return {
      heroToAbout: sanitizeGap(heroToAbout, 24),
      aboutToSkill: sanitizeGap(aboutToSkill, 24),
      skillToWork: sanitizeGap(skillToWork, 24),
      workToTeam: sanitizeGap(workToTeam, 24),
      teamToContact: sanitizeGap(teamToContact, 48),
      contactToFooter: sanitizeGap(contactToFooter, 24)
    };
  }

  // Returns the first matching HTMLElement for a selector.
  private getElement(selector: string) {
    return document.querySelector(selector) as HTMLElement | null;
  }

  // Sizes overlay canvas from real content so footer stays at viewport bottom without extra gap.
  private syncOverlayHeight() {
    requestAnimationFrame(() => {
      if (!this.isOverlayOpen()) {
        return;
      }
      const header = this.getElement('app-header header');
      const panel = this.getElement('.legal-overlay-panel .legal-page');
      const footer = this.getElement('app-footer .footer');
      if (!header || !panel || !footer) {
        return;
      }
      const totalContentHeight = header.offsetHeight + panel.offsetHeight + footer.offsetHeight;
      const minHeightForViewport = window.innerHeight / Math.max(this.scale(), 0.01);
      this.canvasHeight.set(Math.ceil(Math.max(totalContentHeight, minHeightForViewport)));
    });
  }

  // Synchronizes overlay resize observation with current route mode.
  private syncOverlayObservation() {
    if (!this.isOverlayOpen()) {
      this.stopOverlayObserver();
      return;
    }
    requestAnimationFrame(() => {
      this.startOverlayObserver();
    });
  }

  // Starts observing overlay section size changes to keep footer fully visible.
  private startOverlayObserver() {
    const header = this.getElement('app-header header');
    const panel = this.getElement('.legal-overlay-panel .legal-page');
    const footer = this.getElement('app-footer .footer');
    if (!header || !panel || !footer) {
      return;
    }
    const isSameTargets =
      this.observedOverlayHeader === header &&
      this.observedOverlayPanel === panel &&
      this.observedOverlayFooter === footer;
    if (isSameTargets && this.overlayResizeObserver) {
      return;
    }
    this.stopOverlayObserver();
    this.observedOverlayHeader = header;
    this.observedOverlayPanel = panel;
    this.observedOverlayFooter = footer;
    this.overlayResizeObserver = new ResizeObserver(() => this.syncOverlayHeight());
    this.overlayResizeObserver.observe(header);
    this.overlayResizeObserver.observe(panel);
    this.overlayResizeObserver.observe(footer);
  }

  // Stops active overlay resize observation.
  private stopOverlayObserver() {
    if (!this.overlayResizeObserver) {
      this.observedOverlayHeader = null;
      this.observedOverlayPanel = null;
      this.observedOverlayFooter = null;
      return;
    }
    this.overlayResizeObserver.disconnect();
    this.overlayResizeObserver = null;
    this.observedOverlayHeader = null;
    this.observedOverlayPanel = null;
    this.observedOverlayFooter = null;
  }

  // Synchronizes overlay mode with current route path.
  private syncOverlayFromUrl() {
    const path = this.router.url.split('?')[0];
    if (path === '/privacy-policy') {
      this.overlayPage.set('privacy');
      this.scrollToTop();
      return;
    }
    if (path === '/legal-notice') {
      this.overlayPage.set('legal');
      this.scrollToTop();
      return;
    }
    if (path === '/social-media-notice') {
      this.overlayPage.set('social');
      this.scrollToTop();
      return;
    }
    this.overlayPage.set('none');
  }

  // Resets viewport and container scroll position when legal overlays are opened.
  private scrollToTop() {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const page = this.getElement('.portfolio-page');
      if (page) {
        page.scrollTop = 0;
      }
    });
  }

  // Removes runtime mobile top variables when desktop layout is active.
  private clearMobileOffsetVars() {
    this.mobileGaps = null;
    document.documentElement.style.removeProperty('--aboutme-mobile-top');
    document.documentElement.style.removeProperty('--skillset-mobile-top');
    document.documentElement.style.removeProperty('--mywork-mobile-top');
    document.documentElement.style.removeProperty('--teamplayer-mobile-top');
    document.documentElement.style.removeProperty('--contact-mobile-top');
    document.documentElement.style.removeProperty('--footer-mobile-top');
    document.documentElement.style.removeProperty('--teamplayer-top');
    document.documentElement.style.removeProperty('--teamplayer-height');
  }
}
