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
    '(window:resize)': 'updateLayout()'
  },
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Portfolio implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  readonly canvasHeight = signal(6777);
  readonly canvasWidth = signal(1440);
  readonly overlayPage = signal<'none' | 'privacy' | 'legal' | 'social'>('none');
  readonly isOverlayOpen = computed(() => this.overlayPage() !== 'none');
  private overlayResizeObserver: ResizeObserver | null = null;
  private observedOverlayHeader: HTMLElement | null = null;
  private observedOverlayPanel: HTMLElement | null = null;
  private observedOverlayFooter: HTMLElement | null = null;
  private readonly mobileSectionGap = 120;
  private mobileGaps: {
    heroToAbout: number;
    aboutToSkill: number;
    skillToWork: number;
    workToTeam: number;
    teamToContact: number;
    contactToFooter: number;
  } | null = null;

  // Initializes responsive runtime layout values at component startup.
  constructor() {
    this.syncOverlayFromUrl();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncOverlayFromUrl();
        if (this.isOverlayOpen()) {
          this.scrollToTop();
        }
        this.updateLayout();
        this.syncOverlayObservation();
      });
    this.updateLayout();
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

  // Updates runtime layout values for desktop, mobile, and overlay modes.
  updateLayout() {
    if (this.isOverlayOpen()) {
      this.applyOverlayLayout();
      return;
    }
    this.applyPortfolioLayout();
  }

  // Applies layout settings while a legal overlay is active.
  private applyOverlayLayout() {
    if (window.innerWidth < 800) {
      this.canvasWidth.set(390);
    } else {
      this.canvasWidth.set(1440);
    }
    this.canvasHeight.set(1200);
    this.syncOverlayHeight();
    this.clearMobileOffsetVars();
  }

  // Applies layout settings for the regular portfolio page.
  private applyPortfolioLayout() {
    if (window.innerWidth < 800) {
      this.applyMobilePortfolioLayout();
      return;
    }
    this.applyDesktopPortfolioLayout();
  }

  // Configures mobile canvas dimensions and keeps mobile offsets in sync.
  private applyMobilePortfolioLayout() {
    this.canvasWidth.set(390);
    this.canvasHeight.set(7120);
    this.syncMobileOffsets();
  }

  // Configures desktop canvas dimensions and removes temporary mobile vars.
  private applyDesktopPortfolioLayout() {
    this.canvasWidth.set(1440);
    this.canvasHeight.set(6777);
    this.clearMobileOffsetVars();
  }

  // Updates mobile section top offsets from current rendered section heights.
  private syncMobileOffsets() {
    requestAnimationFrame(() => {
      if (window.innerWidth >= 800) {
        return;
      }
      this.applyMeasuredMobileOffsets();
      requestAnimationFrame(() => {
        if (window.innerWidth < 800) {
          this.applyMeasuredMobileOffsets();
        }
      });
    });
  }

  // Measures all mobile sections and writes dynamic top vars while preserving current gaps.
  private applyMeasuredMobileOffsets() {
    const sections = this.getMobileSections();
    if (!sections) {
      return;
    }
    this.ensureMobileGaps(sections);
    const tops = this.calculateMobileTops(sections);
    this.applyMobileTopVars(sections.team, tops);
    this.canvasHeight.set(tops.footerTop + sections.footer.offsetHeight + this.mobileSectionGap);
  }

  // Initializes cached mobile section gaps once from the current measured layout.
  private ensureMobileGaps(sections: {
    hero: HTMLElement; about: HTMLElement; skill: HTMLElement; myWork: HTMLElement;
    team: HTMLElement; contact: HTMLElement; footer: HTMLElement;
  }) {
    if (this.mobileGaps) return;
    this.mobileGaps = this.captureMobileGaps(
      sections.hero, sections.about, sections.skill, sections.myWork,
      sections.team, sections.contact, sections.footer
    );
  }

  // Reads all mobile section elements and returns null when one is missing.
  private getMobileSections() {
    const hero = this.getElement('app-main .hero');
    const about = this.getElement('app-aboutme .letsWorkTogether');
    const skill = this.getElement('app-skillset .SkillSet');
    const myWork = this.getElement('app-mywork .myWork');
    const team = this.getElement('app-teamplayer .teamPlayer');
    const contact = this.getElement('app-contact .contact');
    const footer = this.getElement('app-footer .footer');
    if (!hero || !about || !skill || !myWork || !team || !contact || !footer) return null;
    return { hero, about, skill, myWork, team, contact, footer };
  }

  // Calculates mobile section top positions based on measured heights and fixed gaps.
  private calculateMobileTops(sections: {
    hero: HTMLElement; about: HTMLElement; skill: HTMLElement; myWork: HTMLElement;
    team: HTMLElement; contact: HTMLElement; footer: HTMLElement;
  }) {
    const gaps = this.mobileGaps!;
    const aboutTop = sections.hero.offsetTop + sections.hero.offsetHeight + gaps.heroToAbout;
    const skillTop = aboutTop + sections.about.offsetHeight + gaps.aboutToSkill;
    const workTop = skillTop + sections.skill.offsetHeight + gaps.skillToWork;
    const teamTop = workTop + sections.myWork.offsetHeight;
    const contactTop = teamTop + sections.team.offsetHeight + 48;
    const footerTop = contactTop + sections.contact.offsetHeight;
    return { aboutTop, skillTop, workTop, teamTop, contactTop, footerTop };
  }

  // Writes all computed mobile top CSS variables to the root document.
  private applyMobileTopVars(team: HTMLElement, tops: {
    aboutTop: number; skillTop: number; workTop: number; teamTop: number; contactTop: number; footerTop: number;
  }) {
    document.documentElement.style.setProperty('--teamplayer-top', `${team.offsetTop}px`);
    document.documentElement.style.setProperty('--teamplayer-height', `${team.offsetHeight}px`);
    document.documentElement.style.setProperty('--aboutme-mobile-top', `${tops.aboutTop}px`);
    document.documentElement.style.setProperty('--skillset-mobile-top', `${tops.skillTop}px`);
    document.documentElement.style.setProperty('--mywork-mobile-top', `${tops.workTop}px`);
    document.documentElement.style.setProperty('--teamplayer-mobile-top', `${tops.teamTop}px`);
    document.documentElement.style.setProperty('--contact-mobile-top', `${tops.contactTop}px`);
    document.documentElement.style.setProperty('--footer-mobile-top', `${tops.footerTop}px`);
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
      this.syncOverlayHeightNow();
    });
  }

  // Applies one overlay height calculation based on current measured content.
  private syncOverlayHeightNow() {
    const elements = this.getOverlayElements();
    if (!elements) {
      return;
    }
    const totalContentHeight = elements.header.offsetHeight + elements.panel.offsetHeight + elements.footer.offsetHeight;
    const minHeightForViewport = window.innerHeight;
    this.canvasHeight.set(Math.ceil(Math.max(totalContentHeight, minHeightForViewport)));
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
    const elements = this.getOverlayElements();
    if (!elements) {
      return;
    }
    if (this.isObservingSameTargets(elements) && this.overlayResizeObserver) {
      return;
    }
    this.resetOverlayObserverTargets(elements);
    this.attachOverlayResizeObserver(elements);
  }

  // Reads all overlay layout elements and returns null when one is missing.
  private getOverlayElements() {
    const header = this.getElement('app-header header');
    const panel = this.getElement('.legal-overlay-panel .legal-page');
    const footer = this.getElement('app-footer .footer');
    if (!header || !panel || !footer) return null;
    return { header, panel, footer };
  }

  // Checks whether the current observer already watches the same overlay nodes.
  private isObservingSameTargets(elements: { header: HTMLElement; panel: HTMLElement; footer: HTMLElement }) {
    return this.observedOverlayHeader === elements.header
      && this.observedOverlayPanel === elements.panel
      && this.observedOverlayFooter === elements.footer;
  }

  // Replaces previous observer targets with the current overlay nodes.
  private resetOverlayObserverTargets(elements: { header: HTMLElement; panel: HTMLElement; footer: HTMLElement }) {
    this.stopOverlayObserver();
    this.observedOverlayHeader = elements.header;
    this.observedOverlayPanel = elements.panel;
    this.observedOverlayFooter = elements.footer;
  }

  // Attaches a resize observer to all overlay nodes to keep canvas height in sync.
  private attachOverlayResizeObserver(elements: { header: HTMLElement; panel: HTMLElement; footer: HTMLElement }) {
    this.overlayResizeObserver = new ResizeObserver(() => this.syncOverlayHeight());
    this.overlayResizeObserver.observe(elements.header);
    this.overlayResizeObserver.observe(elements.panel);
    this.overlayResizeObserver.observe(elements.footer);
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
    const page = this.resolveOverlayPage(path);
    this.overlayPage.set(page);
    if (page !== 'none') {
      this.scrollToTop();
    }
  }

  // Resolves the overlay page key from the current route path.
  private resolveOverlayPage(path: string): 'none' | 'privacy' | 'legal' | 'social' {
    const routeMap: Record<string, 'privacy' | 'legal' | 'social'> = {
      '/privacy-policy': 'privacy',
      '/legal-notice': 'legal',
      '/social-media-notice': 'social'
    };
    return routeMap[path] ?? 'none';
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
