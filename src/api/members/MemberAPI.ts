import { request } from "../CommonApi";

export const getMemberByProjectId = async (projectId: number) => {
    return await request(`http://localhost:8080/api/v1/members/project/${projectId}`);
}