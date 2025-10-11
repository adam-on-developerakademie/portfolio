import { Component, inject } from '@angular/core';
import { DATA } from '../../services/data';


@Component({
  selector: 'app-mywork',
  imports: [],
  templateUrl: './mywork.html',
  styleUrl: './mywork.scss'
})
export class MyWork {
  myData = inject(DATA);

}
