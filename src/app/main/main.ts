import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../services/data';


@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  constructor(public myData: DATA) { }
  

}
