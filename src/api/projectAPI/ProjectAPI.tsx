import { request, requestWithPost } from "../CommonApi";

export const getProjectById = async (projectId: number) => {
    return await request(`http://localhost:8080/api/v1/projects/${projectId}`);
}
export const getAllProjectByUserEmail = async (email: string, page: number, pageSize: number) => {
    return await request(`http://localhost:8080/api/v1/projects/user/${email}?page=${page}&size=${pageSize}`);
}
export const getMentorsByProjectId = async (projectId: number) => {
    return await request(`http://localhost:8080/api/v1/projects/${projectId}/mentors`);
}
export const getMembersByProjectId = async (projectId: number) => {
    return await request(`http://localhost:8080/api/v1/projects/${projectId}/members`);
}
export const getProjectsByMentorEmail = async (email: string, page: number, pageSize: number) => {
    return await request(`http://localhost:8080/api/v1/projects/mentor/${email}?page=${page}&size=${pageSize}`);
}
export const getAllProjectByAdmin = async (page: number, pageSize: number, sortBy = 'id', direction = "DESC", searchField = "", search = "") => {
    return await request(`http://localhost:8080/api/v1/admin/projects?page=${page}&size=${pageSize}&sort=${sortBy}&direction=${direction}&searchField=${searchField}&search=${search}`);
}
export const getMembersByProjectIds = async (projectIds: number[]) => {
    return await requestWithPost(`http://localhost:8080/api/v1/members/projects/members`, projectIds);
}
export const getDocumentsByProjectIds = async (projectIds: number[]) => {
    return await requestWithPost(`http://localhost:8080/api/v1/documents/projects`, projectIds);
}