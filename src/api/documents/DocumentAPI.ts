import { request } from "../CommonApi";

export const getAllDocumentByProjectId = async (projectId: number) => {
    return await request(`http://localhost:8080/api/v1/documents/project/${projectId}`);
}