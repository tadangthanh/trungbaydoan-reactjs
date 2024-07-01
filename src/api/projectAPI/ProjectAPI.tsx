import { request } from "../CommonApi";

export const getProjectById = async (projectId: number) => {
    return await request(`http://localhost:8080/api/v1/projects/${projectId}`);
}