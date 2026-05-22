import { Component, signal, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Header } from "../header/header";
import { Main } from '../main/main';
import { Aboutme } from '../aboutme/aboutme';
import { SkillSet } from '../skillset/skillset';
import { MyWork } from '../mywork/mywork';
import { TeamPlayer } from '../teamplayer/teamplayer';  
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';


@Component({
  selector: 'app-portfolio',
  imports: [ Header, Main, Aboutme, SkillSet, MyWork, TeamPlayer, Contact, Footer],
  host: {
    '(window:resize)': 'updateScale()'
  },
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Portfolio implements AfterViewInit {
  readonly canvasHeight = signal(6587);
  readonly canvasWidth = signal(1440);
  readonly scale = signal(1);
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
    this.updateScale();
  }

  // Initializes runtime mobile offsets after first render.
  ngAfterViewInit() {
    this.syncMobileOffsets();
  }

  // Updates the desktop canvas scale to fit narrower viewports without clipping.
  updateScale() {
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
    this.canvasHeight.set(6587);
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
    const gaps = this.mobileGaps;
    const aboutTop = hero.offsetTop + hero.offsetHeight + gaps.heroToAbout;
    const skillTop = aboutTop + about.offsetHeight + gaps.aboutToSkill;
    const workTop = skillTop + skill.offsetHeight + gaps.skillToWork;
    const teamTop = workTop + myWork.offsetHeight + gaps.workToTeam;
    const contactTop = teamTop + team.offsetHeight + gaps.teamToContact;
    const footerTop = contactTop + contact.offsetHeight + gaps.contactToFooter;
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
    return {
      heroToAbout: about.offsetTop - (hero.offsetTop + hero.offsetHeight),
      aboutToSkill: skill.offsetTop - (about.offsetTop + about.offsetHeight),
      skillToWork: myWork.offsetTop - (skill.offsetTop + skill.offsetHeight),
      workToTeam: team.offsetTop - (myWork.offsetTop + myWork.offsetHeight),
      teamToContact: contact.offsetTop - (team.offsetTop + team.offsetHeight),
      contactToFooter: footer.offsetTop - (contact.offsetTop + contact.offsetHeight)
    };
  }

  // Returns the first matching HTMLElement for a selector.
  private getElement(selector: string) {
    return document.querySelector(selector) as HTMLElement | null;
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
  }
}
