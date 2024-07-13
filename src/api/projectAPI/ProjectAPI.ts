import { ProjectCreate } from "../../model/ProjectCreate";
import { ProjectDeleteRequest } from "../../model/ProjectDeleteRequest";
import { ProjectDTO } from "../../model/ProjectDTO";
import { apiUrl, request, requestWithMethod, requestWithPost } from "../CommonApi";

export const getProjectById = async (projectId: number) => {
    return await request(`${apiUrl}/projects/${projectId}`);
}
export const getAllProjectByUserEmail = async (email: string, page: number, pageSize: number) => {
    return await request(`${apiUrl}/projects/user/${email}?page=${page}&size=${pageSize}`);
}
export const getMentorsByProjectId = async (projectId: number) => {
    return await request(`${apiUrl}/projects/${projectId}/mentors`);
}
export const getMembersByProjectId = async (projectId: number) => {
    return await request(`${apiUrl}/projects/${projectId}/members`);
}
export const getProjectsByMentorEmail = async (email: string, page: number, pageSize: number) => {
    return await request(`${apiUrl}/projects/mentor/${email}?page=${page}&size=${pageSize}`);
}
export const getAllProjectByAdmin = async (page: number, pageSize: number, sortBy = 'id', direction = "DESC", searchField = "", search = "") => {
    return await request(`${apiUrl}/admin/projects?page=${page}&size=${pageSize}&sort=${sortBy}&direction=${direction}&searchField=${searchField}&search=${search}`);
}
export const getMembersByProjectIds = async (projectIds: number[]) => {
    return await requestWithPost(`${apiUrl}/members/projects/members`, projectIds);
}
export const getDocumentsByProjectIds = async (projectIds: number[]) => {
    return await requestWithPost(`${apiUrl}/documents/projects`, projectIds);
}
export const deleteProjectByIds = async (projectDeleteRequest: ProjectDeleteRequest) => {
    return await requestWithMethod(`${apiUrl}/projects`, 'DELETE', projectDeleteRequest);
}
export const rejectPRojectByIds = async (projectDeleteRequest: ProjectDeleteRequest) => {
    return await requestWithMethod(`${apiUrl}/projects/reject`, 'POST', projectDeleteRequest);
}
export const approveProjectByIds = async (projectDeleteRequest: ProjectDeleteRequest) => {
    return await requestWithMethod(`${apiUrl}/projects/approve`, 'POST', projectDeleteRequest);
}
export const activeProjectByIds = async (projectDeleteRequest: ProjectDeleteRequest) => {
    return await requestWithMethod(`${apiUrl}/projects/activate`, 'POST', projectDeleteRequest);
}
export const inactiveProjectByIds = async (projectDeleteRequest: ProjectDeleteRequest) => {
    return await requestWithMethod(`${apiUrl}/projects/inactivate`, 'POST', projectDeleteRequest);
}
export const updateProject = async (projectId: number, project: ProjectDTO) => {
    return await requestWithMethod(`${apiUrl}/projects/${projectId}`, 'PATCH', project);
}
export const getAllProjectByCategory = async (categoryId: number, page: number, pageSize: number) => {
    return await request(`${apiUrl}/projects/category/${categoryId}?page=${page}&size=${pageSize}`);
}
export const getAllProject = async (page: number, pageSize: number, sortBy = 'id', direction = "DESC", map: Map<string, string>) => {
    const params = new URLSearchParams();
    map.forEach((value, key) => {
        params.append(key, value);
    });
    return await request(`${apiUrl}/projects?page=${page}&size=${pageSize}&sort=${sortBy}&direction=${direction}&${params.toString()}`);
}
export const createProject = async (project: ProjectCreate): Promise<any> => {
    const url = apiUrl + "/projects";
    const response = requestWithPost(url, project);
    return response;
}
export const getAllProjectPending = async (email: String, page: number, pageSize: number) => {
    return await request(`${apiUrl}/projects/pending/${email}?page=${page}&size=${pageSize}`);
}