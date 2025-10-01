import { Injectable } from '@angular/core';
import { data } from '../interfaces/data';

@Injectable({
  providedIn: 'root'
})
export class DATA {

  public DATA: data = {
    language: 0,
    languages: { set: true, values: ['EN', 'DE'] },
    header: {
      aboutMe: { set: false, values: ['About me', 'Über mich'] },
      skillSet: { set: false, values: ['Skill set', 'Fähigkeiten'] },
      myWork: { set: false, values: ['My work', 'Projekt'] },
    },
    hero: {
      photo: { xPosition: 0, width: 645},
      hello: { xPosition: 731, width: 645, values: ['Hello! I am Adam', 'Hallo! Ich bin Adam, ein Frontend Entwickler.'] },
      profesion: { xPosition: 731, width: 645, values: ['Frontend & Backend Developer', 'Frontend und Backend Entwickler'] },
      scroll: { xPosition: 731, width: 645, values: ['Scroll down', 'Runterscrollen'] },
      scrollline: { xPosition: 731, width: 645 },
      socialButtons: { xPosition: 731, width: 645 }
    }
  };
}