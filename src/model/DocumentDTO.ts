export class DocumentDTO {
    id: number;
    name: string;
    size: string;
    constructor(id: number, name: string, size: string) {
        this.id = id
        this.name = name;
        this.size = size;
    }
}