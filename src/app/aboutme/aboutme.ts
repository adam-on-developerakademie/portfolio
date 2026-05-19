import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-aboutme',
  imports: [CommonModule],
  templateUrl: './aboutme.html',
  styleUrl: './aboutme.scss'
})
export class Aboutme {
  myData = inject(DATA);

  static  letsWorkTogetherButton = document.getElementById('letsWorkTogetherButton') as HTMLButtonElement;

}
