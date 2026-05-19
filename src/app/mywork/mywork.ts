import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';


@Component({
  selector: 'app-mywork',
  imports: [CommonModule],
  templateUrl: './mywork.html',
  styleUrl: './mywork.scss'
})
export class MyWork {
  myData = inject(DATA);

}
