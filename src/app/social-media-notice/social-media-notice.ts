import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-social-media-notice',
  imports: [CommonModule],
  templateUrl: './social-media-notice.html',
  styleUrl: './social-media-notice.scss'
})
export class SocialMediaNotice {
  // Provides access to shared language state for localized content.
  myData = inject(DATA);
}
