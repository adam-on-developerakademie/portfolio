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
    }
  }
}
