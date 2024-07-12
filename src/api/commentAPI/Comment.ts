import { CommentDTO } from "../../model/CommentDTO";
import { apiUrl, request, requestWithPost } from "../CommonApi";

export async function getAllCommentByProjectId(projectId: number, page = 1, pageSize = 5) {
    return await request(apiUrl + `/comments/project/${projectId}?page=${page}&size=${pageSize}`);
}
export async function getAllCommentChildByParentId(parentId: number, page: number, pageSize: number) {
    return await request(apiUrl + `/comments/parent-comment/${parentId}?page=${page}&size=${pageSize}`);
}
export async function createComment(commentDTO: CommentDTO) {
    return await requestWithPost(apiUrl + `/comments`, commentDTO);
}
export async function deleteComment(commentId: number) {
    return await request(apiUrl + `/comments/${commentId}`, 'DELETE');
}
export async function getCommentByCommentIdAndProjectId(commentId: number, projectId: number) {
    return await request(apiUrl + `/comments/${commentId}/project/${projectId}`);
}