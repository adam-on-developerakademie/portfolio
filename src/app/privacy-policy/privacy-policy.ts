import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicy {
  // Provides access to shared application data service.
  myData = inject(DATA);
}
