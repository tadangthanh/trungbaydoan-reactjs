import { request } from "../CommonApi";

export const getGroupByProjectId = async (projectId: number) => {
    return await request(`http://localhost:8080/api/v1/groups/project/${projectId}`);
}