export class DocumentDTO {
    id: number;
    name: string;
    size: string;
    projectId: number;
    type: string;
    mimeType: string;

    constructor(id: number, name: string, size: string, projectId: number, type: string, mimeType: string) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.projectId = projectId;
        this.type = type;
        this.mimeType = mimeType;
    }
}