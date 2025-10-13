import { Component, inject } from '@angular/core';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  myData = inject(DATA);

}
