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

  constructor(public myData: DATA) { };

  goToNew(elementId: HTMLElement) {
    console.log(elementId);
    
    if (elementId) {
      elementId.scrollIntoView({ behavior: 'smooth' });
    }
  }

    goToOld(elementId: string) {
    const element: HTMLElement = document.getElementById(elementId) as HTMLElement;
    element.id = elementId;
    console.log(element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}