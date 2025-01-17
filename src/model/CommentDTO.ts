export class CommentDTO {
    id: number;
    content: string;
    projectId: number;
    authorName: string;
    parentCommentId: number;
    authorAvatarId: number;
    createdDate: string;
    totalReply: number;
    createdBy: string;
    authorEmail: string;
    receiverEmail: string;
    authorAvatarUrl;

    constructor(id: number, content: string, projectId: number, authorName: string, parentCommentId: number, authorAvatarId: number, createdDate: string, totalReply: number, createdBy: string, authorEmail: string, receiverEmail: string, authorAvatarUrl: string) {
        this.id = id;
        this.content = content;
        this.projectId = projectId;
        this.authorName = authorName;
        this.parentCommentId = parentCommentId;
        this.authorAvatarId = authorAvatarId;
        this.createdDate = createdDate;
        this.totalReply = totalReply;
        this.createdBy = createdBy;
        this.authorEmail = authorEmail;
        this.receiverEmail = receiverEmail;
        this.authorAvatarUrl = authorAvatarUrl;
    }
}