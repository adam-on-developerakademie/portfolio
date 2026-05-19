import { Routes } from '@angular/router';
import { Portfolio } from './portfolio/portfolio';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { LegalNotice } from './legal-notice/legal-notice';

// Application routes: main portfolio page and legal pages.
export const routes: Routes = [
  { path: '', component: Portfolio },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'legal-notice', component: LegalNotice }
];
