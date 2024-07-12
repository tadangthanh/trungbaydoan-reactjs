import { apiUrl, request } from "../CommonApi";

export const getMemberByProjectId = async (projectId: number) => {
    return await request(`${apiUrl}/members/project/${projectId}`);
}