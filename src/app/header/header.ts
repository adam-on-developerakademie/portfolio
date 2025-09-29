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

}


