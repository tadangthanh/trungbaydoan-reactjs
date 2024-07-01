import { CommentDTO } from "../../model/CommentDTO";
import { request, requestWithPost } from "../CommonApi";

export async function getAllCommentByProjectId(projectId: number, page = 1, pageSize = 5) {
    return await request(`http://localhost:8080/api/v1/comments/project/${projectId}?page=${page}&size=${pageSize}`);
}
export async function getAllCommentChildByParentId(parentId: number, page: number, pageSize: number) {
    return await request(`http://localhost:8080/api/v1/comments/parent-comment/${parentId}?page=${page}&size=${pageSize}`);
}
export async function createComment(commentDTO: CommentDTO) {
    return await requestWithPost(`http://localhost:8080/api/v1/comments`, commentDTO);
}
export async function deleteComment(commentId: number) {
    return await request(`http://localhost:8080/api/v1/comments/${commentId}`, 0, 'DELETE');
}