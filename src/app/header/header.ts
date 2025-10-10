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

  goToSection(section: string) {
      this.myData.DATA.header.filter(s => s.name === section)[0].set = true;
      this.myData.DATA.header.filter(s => s.name !== section).forEach(s => s.set = false);
  }

}