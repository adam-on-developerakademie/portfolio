export interface data {
        language: number;
        mobile: number;
        screenWidth: string[];
        languages: { set: boolean, values: string[] };
        header: {
                aboutMe: { set: boolean, values: string[] };
                skillSet: { set: boolean, values: string[] };
                myWork: { set: boolean, values: string[] };
        };
        hero: {
                photo: { x: number[], y: number[], width: number[] };
                hello: { x: number[], y: number[], width: number[], height: number[], font: number[], values: string[] };
                profession: { x: number[], y: number[], width: number[], height: number[], font: number[], values: string[][] };
                scroll: { x: number[], y: number[], width: number[], font: number[], values: string[] };
                scrollline: { x: number[], y: number[], width: number[], height: number[] };
                socialButtons: { x: number[], y: number[], width: number[], height: number[], values: { name: string, icon: string, link: string }[] };
        }
}