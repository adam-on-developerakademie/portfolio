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
  private readonly mobileBreakpoint = 950;
  private readonly mobileSectionGap = 120;
  private mobileGaps: {
    heroToAbout: number;
    aboutToSkill: number;
    skillToWork: number;
    workToTeam: number;
    teamToContact: number;
    contactToFooter: number;
  } | null = null;
  private readonly desktopGaps = { heroToAbout: 242 - (206 / 2), aboutToSkill: 127, skillToWork: 0, workToTeam: 77, teamToContact: 93, contactToFooter: 0 };
  // Initializes responsive runtime layout values at component startup.
  constructor() {
    this.syncOverlayFromUrl();
    this.attachLoadEventListener();
    this.subscribeToNavigationEvents();
    this.updateLayout();
  }

  // Attaches load listener to recalculate offsets after assets finish loading.
  private attachLoadEventListener() {
    window.addEventListener('load', () => this.updateLayout(), { once: true });
  }

  // Subscribes to route changes to synchronize overlay and layout state.
  private subscribeToNavigationEvents() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncOverlayFromUrl();
        if (this.isOverlayOpen()) this.scrollToTop();
        this.updateLayout();
        this.syncOverlayObservation();
      });
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
    if (window.innerWidth < this.mobileBreakpoint) {
      this.canvasWidth.set(window.innerWidth);
    } else {
      this.canvasWidth.set(1440);
    }
    this.canvasHeight.set(1200);
    this.syncOverlayHeight();
    this.clearMobileOffsetVars();
    this.clearDesktopOffsetVars();
  }

  // Applies layout settings for the regular portfolio page.
  private applyPortfolioLayout() {
    if (window.innerWidth < this.mobileBreakpoint) {
      this.applyMobilePortfolioLayout();
      return;
    }
    this.applyDesktopPortfolioLayout();
  }
  // Configures mobile canvas dimensions and keeps mobile offsets in sync.
  private applyMobilePortfolioLayout() {
    this.canvasWidth.set(window.innerWidth);
    this.canvasHeight.set(7120);
    this.clearDesktopOffsetVars();
    this.syncMobileOffsets();
  }
  // Configures desktop canvas dimensions and removes temporary mobile vars.
  private applyDesktopPortfolioLayout() {
    this.canvasWidth.set(1440);
    this.clearMobileOffsetVars();
    this.syncDesktopOffsets();
  }

  // Updates desktop section top offsets from current rendered section heights.
  private syncDesktopOffsets() {
    requestAnimationFrame(() => {
      if (window.innerWidth < this.mobileBreakpoint || this.isOverlayOpen()) return;
      this.applyMeasuredDesktopOffsets();
      requestAnimationFrame(() => {
        if (window.innerWidth >= this.mobileBreakpoint && !this.isOverlayOpen()) this.applyMeasuredDesktopOffsets();
      });
    });
  }

  // Measures desktop sections and writes dynamic top vars to avoid overlaps.
  private applyMeasuredDesktopOffsets() {
    const sections = this.getMobileSections();
    if (!sections) return;
    const tops = this.calculateSectionTops(sections, this.desktopGaps);
    this.applyDesktopTopVars(tops, sections.team);
    this.canvasHeight.set(tops.footerTop + sections.footer.offsetHeight);
  }

  // Writes computed desktop top CSS variables to all absolute-positioned sections.
  private applyDesktopTopVars(tops: {
    aboutTop: number; skillTop: number; workTop: number; teamTop: number; contactTop: number; footerTop: number;
  }, team: HTMLElement) {
    this.setCSSVars({
      '--aboutme-top': `${tops.aboutTop}px`,
      '--skillset-top': `${tops.skillTop}px`,
      '--mywork-top': `${tops.workTop}px`,
      '--teamplayer-top': `${tops.teamTop}px`,
      '--teamplayer-height': `${team.offsetHeight}px`,
      '--contact-top': `${tops.contactTop}px`,
      '--footer-top': `${tops.footerTop}px`
    });
  }
  // Updates mobile section top offsets from current rendered section heights.
  private syncMobileOffsets() {
    requestAnimationFrame(() => {
      if (window.innerWidth >= this.mobileBreakpoint) {
        return;
      }
      this.applyMeasuredMobileOffsets();
      requestAnimationFrame(() => {
        if (window.innerWidth < this.mobileBreakpoint) {
          this.applyMeasuredMobileOffsets();
        }
      });
    });
  }

  // Measures all mobile sections and writes dynamic top vars while preserving current gaps.
  private applyMeasuredMobileOffsets() {
    const sections = this.getMobileSections();
    if (!sections) return;
    this.ensureMobileGaps(sections);
    const tops = this.calculateSectionTops(sections, this.mobileGaps!);
    this.applyMobileSectionOffsets(sections, tops);
    this.applyMobileTopVars(sections.team, tops);
    this.canvasHeight.set(tops.footerTop + sections.footer.offsetHeight + this.mobileSectionGap);
  }

  // Recalculates mobile section positions accounting for dynamic workflow offsets.
  private applyMobileSectionOffsets(sections: {
    hero: HTMLElement; about: HTMLElement; skill: HTMLElement; myWork: HTMLElement;
    team: HTMLElement; contact: HTMLElement; footer: HTMLElement;
  }, tops: any) {
    tops.aboutTop = sections.hero.offsetTop + sections.hero.offsetHeight;
    tops.skillTop = tops.aboutTop + sections.about.offsetHeight;
    const workOffset = this.calculateWorkflowOffset(sections);
    tops.workTop = (tops.skillTop + sections.skill.offsetHeight) - workOffset;
    const rendered = tops.workTop + workOffset;
    tops.teamTop = rendered + sections.myWork.offsetHeight + this.mobileGaps!.workToTeam;
    tops.contactTop = tops.teamTop + sections.team.offsetHeight + this.mobileGaps!.teamToContact;
    tops.footerTop = tops.contactTop + sections.contact.offsetHeight;
  }

  // Calculates offset between desired and rendered work section positions.
  private calculateWorkflowOffset(sections: { myWork: HTMLElement }): number {
    const currentTop = parseFloat(getComputedStyle(sections.myWork).top || '0') || 0;
    return sections.myWork.offsetTop - currentTop;
  }

  // Initializes cached mobile section gaps once from the current measured layout.
  private ensureMobileGaps(sections: {
    hero: HTMLElement; about: HTMLElement; skill: HTMLElement; myWork: HTMLElement;
    team: HTMLElement; contact: HTMLElement; footer: HTMLElement;
  }) {
    if (this.mobileGaps) return;
    this.mobileGaps = this.captureMobileGaps(sections);
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

  // Calculates section top positions based on measured heights and provided gaps.
  private calculateSectionTops(sections: {
    hero: HTMLElement; about: HTMLElement; skill: HTMLElement; myWork: HTMLElement;
    team: HTMLElement; contact: HTMLElement; footer: HTMLElement;
  }, gaps: {
    heroToAbout: number; aboutToSkill: number; skillToWork: number;
    workToTeam: number; teamToContact: number; contactToFooter: number;
  }) {
    const aboutTop = sections.hero.offsetTop + sections.hero.offsetHeight + gaps.heroToAbout;
    const skillTop = aboutTop + sections.about.offsetHeight + gaps.aboutToSkill;
    const workTop = skillTop + sections.skill.offsetHeight + gaps.skillToWork;
    const teamTop = workTop + sections.myWork.offsetHeight + gaps.workToTeam;
    const contactTop = teamTop + sections.team.offsetHeight + gaps.teamToContact;
    const footerTop = contactTop + sections.contact.offsetHeight + gaps.contactToFooter;
    return { aboutTop, skillTop, workTop, teamTop, contactTop, footerTop };
  }

  // Writes all computed mobile top CSS variables to the root document.
  private applyMobileTopVars(team: HTMLElement, tops: {
    aboutTop: number; skillTop: number; workTop: number; teamTop: number; contactTop: number; footerTop: number;
  }) {
    this.setCSSVars({
      '--teamplayer-top': `${team.offsetTop}px`,
      '--teamplayer-height': `${team.offsetHeight}px`,
      '--aboutme-mobile-top': `${tops.aboutTop}px`,
      '--skillset-mobile-top': `${tops.skillTop}px`,
      '--mywork-mobile-top': `${tops.workTop}px`,
      '--teamplayer-mobile-top': `${tops.teamTop}px`,
      '--contact-mobile-top': `${tops.contactTop}px`,
      '--footer-mobile-top': `${tops.footerTop}px`
    });
  }

  // Captures current visual gaps once and keeps them while section heights change.
  private captureMobileGaps(s: any) {
    return {
      heroToAbout: this.sanitizeGap(s.about.offsetTop - (s.hero.offsetTop + s.hero.offsetHeight), 24),
      aboutToSkill: this.sanitizeGap(s.skill.offsetTop - (s.about.offsetTop + s.about.offsetHeight), 24),
      skillToWork: this.sanitizeGap(s.myWork.offsetTop - (s.skill.offsetTop + s.skill.offsetHeight), 24),
      workToTeam: this.sanitizeGap(s.team.offsetTop - (s.myWork.offsetTop + s.myWork.offsetHeight), 24),
      teamToContact: this.sanitizeGap(s.contact.offsetTop - (s.team.offsetTop + s.team.offsetHeight), 48),
      contactToFooter: this.sanitizeGap(s.footer.offsetTop - (s.contact.offsetTop + s.contact.offsetHeight), 24)
    };
  }

  // Validates gap value is within realistic range to avoid runaway offsets.
  private sanitizeGap(value: number, fallback: number): number {
    if (!Number.isFinite(value) || value < 0 || value > 320) return fallback;
    return value;
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
    if (!elements || (this.isObservingSameTargets(elements) && this.overlayResizeObserver)) return;
    this.stopOverlayObserver();
    this.observedOverlayHeader = elements.header;
    this.observedOverlayPanel = elements.panel;
    this.observedOverlayFooter = elements.footer;
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

  // Attaches a resize observer to all overlay nodes to keep canvas height in sync.
  private attachOverlayResizeObserver(elements: { header: HTMLElement; panel: HTMLElement; footer: HTMLElement }) {
    this.overlayResizeObserver = new ResizeObserver(() => this.syncOverlayHeight());
    this.overlayResizeObserver.observe(elements.header);
    this.overlayResizeObserver.observe(elements.panel);
    this.overlayResizeObserver.observe(elements.footer);
  }

  // Stops active overlay resize observation.
  private stopOverlayObserver() {
    if (this.overlayResizeObserver) {
      this.overlayResizeObserver.disconnect();
      this.overlayResizeObserver = null;
    }
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
    this.removeCSSVars(['--aboutme-mobile-top', '--skillset-mobile-top', '--mywork-mobile-top',
      '--teamplayer-mobile-top', '--contact-mobile-top', '--footer-mobile-top']);
  }

  // Removes runtime desktop top variables when mobile or overlay layout is active.
  private clearDesktopOffsetVars() {
    this.removeCSSVars(['--aboutme-top', '--skillset-top', '--mywork-top', '--teamplayer-top',
      '--teamplayer-height', '--contact-top', '--footer-top']);
  }

  // Applies multiple CSS variables to document root in one operation.
  private setCSSVars(vars: Record<string, string>) {
    Object.entries(vars).forEach(([key, value]) =>
      document.documentElement.style.setProperty(key, value));
  }

  // Removes multiple CSS variables from document root in one operation.
  private removeCSSVars(names: string[]) {
    names.forEach(name => document.documentElement.style.removeProperty(name));
  }
}
