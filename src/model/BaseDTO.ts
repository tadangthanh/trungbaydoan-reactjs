export class BaseDTO {
    id: number;
    createdDate: Date;
    lastModifiedDate: Date;
    createdBy: string;
    lastModifiedBy: string;
    constructor(id: number, createdDate: Date, lastModifiedDate: Date, createdBy: string, lastModifiedBy: string) {
        this.id = id;
        this.createdDate = createdDate;
        this.lastModifiedDate = lastModifiedDate;
        this.createdBy = createdBy;
        this.lastModifiedBy = lastModifiedBy;
    }
}