export class NotificationDTO {
    id: number;
    message: string;
    seen: boolean;
    projectId: number;
    commentId: number;
    createdDate: string;
    createdBy: string;

    constructor(id: number, message: string, seen: boolean, projectId: number, commentId: number, createdDate: string, createdBy: string) {
        this.id = id;
        this.message = message;
        this.seen = seen;
        this.projectId = projectId;
        this.commentId = commentId;
        this.createdDate = createdDate;
        this.createdBy = createdBy;
    }

}