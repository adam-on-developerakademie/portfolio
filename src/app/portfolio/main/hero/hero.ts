import { Component, HostListener } from '@angular/core';
import { DATA } from '../../../services/data';


@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  screenWidth: number | undefined;
  constructor(public myData: DATA) {
    document.documentElement.style.setProperty('--screenWidth', this.screenWidth + 'px');

    document.documentElement.style.setProperty('--hello-top', this.myData.DATA.hero.hello.y[this.myData.DATA.mobile] + 'px');
    document.documentElement.style.setProperty('--hello-width', this.myData.DATA.hero.hello.width[this.myData.DATA.mobile] + 'px');
    document.documentElement.style.setProperty('--hello-height', this.myData.DATA.hero.hello.height[this.myData.DATA.mobile] + 'px');
    document.documentElement.style.setProperty('--hello-font', this.myData.DATA.hero.hello.font[this.myData.DATA.mobile] + 'px');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth; // Aktualisiert die Breite bei Größenänderung
    (this.myData.DATA.mobile == 0 && this.screenWidth > 1440) ? this.screenWidth = 1440 : '';
    document.documentElement.style.setProperty('--screenWidth', this.screenWidth + 'px');
    document.documentElement.style.setProperty('--hello-left', this.myData.DATA.hero.hello.x[this.myData.DATA.mobile] + 'px');
    console.log(`Hello from Hero component ${this.screenWidth} ${this.myData.DATA.hero.hello.x[this.myData.DATA.mobile]}`);
  }
  ngOnInit() {
    this.screenWidth = window.innerWidth; // Holt die initiale Breite beim Laden der Komponente
    (this.myData.DATA.mobile == 0 && this.screenWidth > 1440) ? this.screenWidth = 1440 : '';
    document.documentElement.style.setProperty('--screenWidth', this.screenWidth + 'px');
    document.documentElement.style.setProperty('--hello-left', this.myData.DATA.hero.hello.x[this.myData.DATA.mobile] + 'px');
    console.log(`Hello from Hero component ${this.screenWidth} ${this.myData.DATA.hero.hello.x[this.myData.DATA.mobile]}`);
  }
}
