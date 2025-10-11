export interface data {
        language: number;
        mobile: number;
        screenWidth: string[];
        languages: { set: boolean, values: string[] };
        header: [
                {name: string, set: boolean, values: string[] },
                {name: string, set: boolean, values: string[] },
                {name: string, set: boolean, values: string[] }
        ];
        hero: {
                photo: { x: number[], y: number[], width: number[] };
                hello: { x: number[], y: number[], width: number[], height: number[], font: number[], values: string[] };
                profession: { x: number[], y: number[], width: number[], height: number[], font: number[], values: string[][] };
                scroll: { x: number[], y: number[], width: number[], font: number[], values: string[] };
                scrollline: { x: number[], y: number[], width: number[], height: number[] };
                socialButtons: { x: number[], y: number[], width: number[], height: number[], values: { name: string, icon: string, link: string }[] };
        };
        letsWorkTogether: {
                text: { x: number[], y: number[], width: number[], height: number[], font: number[], values: string[][] };
                icons: { icon: string[][], values: string[][] };
                button: { email: string[], values: string[] };
                
        };
        skillSet: {
                title: { values: string[] };
                skills: { values: { name: string, icon: string, level: number }[] };
        };
        myWork: {
                title: { values: string[] };
                text: { values: string[] };
        };
}