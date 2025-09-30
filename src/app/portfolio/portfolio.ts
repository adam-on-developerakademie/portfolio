import { Component } from '@angular/core';
import { Header } from './header/header';
import { Main } from './main/main';

@Component({
  selector: 'app-portfolio',
  imports: [Header, Main],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {

}
