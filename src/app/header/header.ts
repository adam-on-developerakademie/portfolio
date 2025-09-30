import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA } from '../services/data';


@Component({
    selector: 'app-header',
    imports: [CommonModule],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header {
    constructor(public myData: DATA) { };

    changeLanguage(index: number) {
        this.myData.DATA.language = index;
        console.log(this.myData.DATA.language);
    }

    goToSection(section: string) {
       let thisSection = eval(`this.myData.DATA.header.${section}`);
         thisSection.set = true;
        let otherSections = ['aboutMe', 'skillSet', 'myWork'].filter(s => s !== section);
        otherSections.forEach(s => {
            let sec = eval(`this.myData.DATA.header.${s}`);
            sec.set = false;
        });


}
}

