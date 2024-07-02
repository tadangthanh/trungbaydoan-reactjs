export class DocumentDTO {
    id: number;
    name: string;
    size: string;
    projectId: number;
    type: string;
    mimeType: string;
    url: string;
    constructor(id: number, name: string, size: string, projectId: number, type: string, mimeType: string, url: string) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.projectId = projectId;
        this.type = type;
        this.mimeType = mimeType;
        this.url = url;
    }
}