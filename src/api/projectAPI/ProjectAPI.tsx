import { request } from "../CommonApi";

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