import { CommentDTO } from "../../model/CommentDTO";
import { getBaseUrl, request, requestWithPost } from "../CommonApi";
const baseUrl = getBaseUrl();
export async function getAllCommentByProjectId(projectId: number, page = 1, pageSize = 5) {
    return await request(baseUrl + `/comments/project/${projectId}?page=${page}&size=${pageSize}`);
}
export async function getAllCommentChildByParentId(parentId: number, page: number, pageSize: number) {
    return await request(baseUrl + `/comments/parent-comment/${parentId}?page=${page}&size=${pageSize}`);
}
export async function createComment(commentDTO: CommentDTO) {
    return await requestWithPost(baseUrl + `/comments`, commentDTO);
}
export async function deleteComment(commentId: number) {
    return await request(baseUrl + `/comments/${commentId}`, 0, 'DELETE');
}
export async function getCommentByCommentIdAndProjectId(commentId: number, projectId: number) {
    return await request(baseUrl + `/comments/${commentId}/project/${projectId}`);
}