export interface data {
language: number;
languages: {set: boolean,values: string[]};
header: {
        aboutMe: {set: boolean, values: string[]}; 
        skillSet: {set: boolean, values: string[]}; 
        myWork: {set: boolean, values: string[]};
        };
hero: {
        photo: {xPosition: number, width: number};
        hello: {xPosition: number, width: number, values: string[]};
        profesion: {xPosition: number, width: number, values: string[]};
        scroll: {xPosition: number, width: number, values: string[]};
        scrollline: {xPosition: number, width: number};
        socialButtons: {xPosition: number, width: number};
        };
}
