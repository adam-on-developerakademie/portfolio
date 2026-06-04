import { Routes } from '@angular/router';
import { Portfolio } from './portfolio/portfolio';

// Application routes: main portfolio page and legal pages.
export const routes: Routes = [
  { path: '', component: Portfolio },
  { path: 'privacy-policy', component: Portfolio },
  { path: 'legal-notice', component: Portfolio }
];
