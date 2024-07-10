
import { DocumentRequest } from "../../model/DocumentRequest";
import { getBaseUrl, request, requestWithMethod, requestWithPostFile } from "../CommonApi";



export const deleteDocument = async (documentId: number) => {
    return await request(getBaseUrl() + `/documents/${documentId}`, 0, 'DELETE');
}
export const getAllDocumentByProjectId = async (projectId: number) => {
    return await request(getBaseUrl() + `/documents/project/${projectId}`);
}
export const getUrlByDocumentId = async (documentId: number) => {
    return await request(getBaseUrl() + `/documents/blob-url/${documentId}`);
}
export const uploadFile = async (formData: FormData) => {
    return await requestWithPostFile(getBaseUrl() + `/documents/upload-progress`, formData);
}
export const deleteDocumentAnonymous = async (documentRequest: DocumentRequest) => {
    return await requestWithMethod(getBaseUrl() + `/documents/delete-anonymous`, 'DELETE', documentRequest);
}
