import { Component } from '@angular/core';
//import { Header } from '../header/header';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

DATA={
  language: 0,
  languages:{set:true,values:['EN','DE']},
  header:{
  aboutMe:{set:false,values:['About me','Über mich']},
  skillSet:{set:false,values:['Skill set','Fähigkeiten']},
  myWork:{set:false,values:['My work','Projekt']},
  }
}

}
