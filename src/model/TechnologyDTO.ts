export class TechnologyDTO {
    name: string;
    id: number;
    acronym: string
    constructor(name: string, id: number, acronym: string) {
        this.name = name;
        this.id = id;
        this.acronym = acronym;
    }
}