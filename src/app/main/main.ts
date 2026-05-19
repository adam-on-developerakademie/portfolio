import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Main {
  myData = inject(DATA);
}
