export class CommentDTO {
    id: number;
    content: string;
    projectId: number;
    authorName: string;
    parentCommentId: number;
    authorAvatar: string;
    createdDate: string;
    totalReply: number;
    createdBy: string;
    authorEmail: string;
    receiverEmail: string;

    constructor(id: number, content: string, projectId: number, authorName: string, parentCommentId: number, authorAvatar: string, createdDate: string, totalReply: number, createdBy: string, authorEmail: string, receiverEmail: string) {
        this.id = id;
        this.content = content;
        this.projectId = projectId;
        this.authorName = authorName;
        this.parentCommentId = parentCommentId;
        this.authorAvatar = authorAvatar;
        this.createdDate = createdDate;
        this.totalReply = totalReply;
        this.createdBy = createdBy;
        this.authorEmail = authorEmail;
        this.receiverEmail = receiverEmail;
    }
}