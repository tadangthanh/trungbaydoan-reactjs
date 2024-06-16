export class Category {
    id: number;
    name: string;
    createdDate: Date;
    lastModifiedDate: Date;
    createdBy: string;
    lastModifiedBy: string;
    constructor(id: number, name: string, createdDate: Date, lastModifiedDate: Date, createdBy: string, lastModifiedBy: string) {
        this.id = id;
        this.name = name;
        this.createdDate = createdDate;
        this.lastModifiedDate = lastModifiedDate;
        this.createdBy = createdBy;
        this.lastModifiedBy = lastModifiedBy;
    }
}