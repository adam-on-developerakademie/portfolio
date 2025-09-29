import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LOGO {

 constructor() { } 

logo: string = `
<svg width="120" height="120" viewBox="0 0 120 120" fill="#5988FF" >
  <text x="17" y="85.4" font-family="Arial Black" font-size="84" fill="#5988FF" opacity="0.7"  transform="rotate(20.5 60,30)">A</text>
  <text x="56" y="90" font-family="Arial Black" font-size="90" fill="#5988FF" opacity="0.7">P</text>
</svg>
`;
 

  
}
