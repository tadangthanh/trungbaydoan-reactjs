import { apiUrl, request } from "../CommonApi";

export const getGroupByProjectId = async (projectId: number) => {
    return await request(`${apiUrl}/groups/project/${projectId}`);
}