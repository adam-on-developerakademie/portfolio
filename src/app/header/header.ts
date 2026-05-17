import { Component, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  // Provides shared data service access for header rendering and interactions.
  constructor(public myData: DATA) { };

  // Updates active header state so only the selected section is highlighted.
  setUnderline(section: string) {
    this.myData.DATA.header.filter(s => s.name === section)[0].set = true;
    this.myData.DATA.header.filter(s => s.name !== section).forEach(s => s.set = false);
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
}