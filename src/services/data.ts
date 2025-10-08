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
      text: { x: [32, 32], y: [1432, 1200], width: [1376, 736], height: [153, 153], font: [64, 64], values: [['Let\'s work together', 'Lass uns beginnen'], ['I am', 'Ich bin'], ['As a passionate fullstack developer, I combine in-depth knowledge of both frontend and backend technologies with a strong enthusiasm for innovative solutions. I draw my inspiration from the opportunity to create real value with my code.', 'Als leidenschaftlicher Fullstack-Entwickler vereine ich fundierte Kenntnisse in Frontend- und Backend-Technologien mit Begeisterung für innovative Lösungen. Meine Inspiration ziehe ich aus der Möglichkeit, mit meinem Code echten Mehrwert zu schaffen.'], ['The connecting creative user interfaces with efficient, scalable logic in the background. My constant drive to learn new things motivates me to regularly explore modern frameworks, programming languages, and best practices, and to integrate them into my work. For me, lifelong learning is a part of my personal motivation.','Mich reitzt dei Verbindung von kreativer Benutzeroberfläche mit effizienter, skalierbarer Logik im Hintergrund. Mein stetiger Drang, Neues zu lernen, treibt mich an, regelmäßig moderne Frameworks, Programmiersprachen und Best Practices zu erforschen und in meine Arbeit zu integrieren. Für mich ist lebenslanges Lernen Teil meiner persönlichen Motivation.']]},
      icons: { icon: [['located.png','locatedPlus.png'],['remote.png','remotePlus.png'],['relocate.png','relocatePlus.png']], values: [['located in Bad Sassendorf', 'zuhause in Bad Sassendorf'], ['open to work remote', 'offen für Fernarbeit'], ['open to relocate', 'offen für Umzug']] },
      button: { email: ['adam.piskorek@gmx.com', 'adam.piskorek@gmx.com'], values: ['Send message', 'Kontaktiere mich'] },

    }
  };
}