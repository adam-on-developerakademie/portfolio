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
      photo: { x: [32, 0], y: [106, 154], width: [761, 645] },
      hello: { x: [731, 197], y: [227, 0], width: [645, 367.72], height: [61, 61], font: [64, 64], values: ['Hello! I am Adam', 'Hallo! Ich bin Adam'] },
      profession: { x: [731, 199.28], y: [305, 30], width: [645, 645], height: [61, 61], font: [128, 128], values: [['fullstack ', 'fullstack '], ['developer', 'developer']] },
      scroll: { x: [987, 731], y: [656, 0], width: [95, 645], font: [23, 23], values: ['SCROLL', 'SCROLL'] },
      scrollline: { x: [1034, 731], y: [694, 0], width: [0, 0], height: [330, 0] },
      socialButtons: {
        x: [1300, 731], y: [789, 0], width: [40, 645], height: [170, 0], values: [
          { name: 'GitHub', icon: 'github.png', link: 'https://github.com/adam-on-developerakademie' },
          { name: 'Email', icon: 'mail.png', link: 'mailto:adam.piskorek@gmx.com' },
          { name: 'LinkedIn', icon: 'linkedin.png', link: 'https://www.linkedin.com/in//' },
        ]
      }
    }, 
    letsWorkTogether: {
      text: { x: [32, 32], y: [1432, 1200], width: [1376, 736], height: [153, 153], font: [64, 64], values: [['Let\'s work together!', 'Lass uns zusammenarbeiten!'], ['I am', 'Ich bin'], ['Write some information about yourself that is IT related. Why are you passionate about programming? What is your source of inspiration for improving your coding skills? Show a desire to learn new technologies. </br> Describe your approach to problem solving. Do you learn from each challenge to find the most efficient or elegant solution? You can include some key attributes such as: analytical thinking, creativity, persistence and collaboration.', 'Schreiben Sie einige Informationen über sich selbst, die mit IT zu tun haben. Warum programmieren Sie leidenschaftlich gern? Was inspiriert Sie, Ihre Programmierkenntnisse zu verbessern? Zeigen Sie den Wunsch, neue Technologien zu erlernen. </br> Beschreiben Sie Ihren Ansatz zur Problemlösung. Lernen Sie aus jeder Herausforderung, um die effizienteste oder eleganteste Lösung zu finden? Sie können einige Schlüsselattribute wie analytisches Denken, Kreativität, Ausdauer und Teamgeist erwähnen.']] },
      icons: { icon:['located.png','remote.png','relocate.png'], values: [['located in Bad Sassendorf', 'zuhause in Bad Sassendorf'], ['open to work remote','offen für Remote-Arbeit'], ['open to relocate', 'offen für einen Umzug']] },
      button: { email: [ 'adam.piskorek@gmx.com', 'adam.piskorek@gmx.com' ], values: ['Send message', 'Kontaktiere mich'] },
      
    }
  };
}