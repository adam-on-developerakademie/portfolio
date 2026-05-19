import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-teamplayer',
  imports: [CommonModule],
  templateUrl: './teamplayer.html',
  styleUrl: './teamplayer.scss'
})
export class TeamPlayer {
  myData = inject(DATA);

}
