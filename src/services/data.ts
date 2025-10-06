import { Injectable } from '@angular/core';
import { data } from '../interfaces/data';

@Injectable({
  providedIn: 'root'
})
export class DATA {

  public DATA: data = {
    language: 0,
    mobile: 0,
    screenWidth: ['1440px', '800px'],
    languages: { set: true, values: ['EN', 'DE'] },
    header: {
      aboutMe: { set: false, values: ['About me', 'Über mich'] },
      skillSet: { set: false, values: ['Skill set', 'Fähigkeiten'] },
      myWork: { set: false, values: ['My work', 'Projekt'] },
    },
    hero: {
      photo: { x: [32,0], y: [106,154], width: [761,645] },
      hello: { x: [731,197], y: [227,0], width: [645,367.72], height: [61,61], font: [64,64], values: ['Hello! I am Adam', 'Hallo! Ich bin Adam'] },
      profession: { x: [731,199.28], y: [305,30], width: [645,645], height: [61,61], font: [128,128], values: [['fullstack ','fullstack '],['developer','developer']] },
      scroll: { x: [987,731], y: [656,0], width: [95,645], font: [23,23], values: ['SCROLL', 'SCROLL'] },
      scrollline: { x: [1034,731], y: [694,0], width: [0,0], height: [330,0] },
      socialButtons: { x: [1300,731], y: [789,0], width: [40,645], height: [170,0] },
    }
  };
}