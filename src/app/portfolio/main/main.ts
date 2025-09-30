import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';
import { Hero } from './hero/hero';


@Component({
  selector: 'app-main',
  imports: [CommonModule, Hero],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  constructor(public myData: DATA) { }
  

}
