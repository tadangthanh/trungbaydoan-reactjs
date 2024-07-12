
import { DocumentRequest } from "../../model/DocumentRequest";
import { apiUrl, request, requestWithMethod, requestWithPostFile } from "../CommonApi";

export const deleteDocument = async (documentId: number) => {
    return await request(apiUrl + `/documents/${documentId}`, 'DELETE');
}
export const getAllDocumentByProjectId = async (projectId: number) => {
    return await request(apiUrl + `/documents/project/${projectId}`);
}
export const getUrlByDocumentId = async (documentId: number) => {
    return await request(apiUrl + `/documents/blob-url/${documentId}`);
}
export const uploadFile = async (formData: FormData) => {
    return await requestWithPostFile(apiUrl + `/documents/upload-progress`, formData);
}
export const deleteDocumentAnonymous = async (documentRequest: DocumentRequest) => {
    return await requestWithMethod(apiUrl + `/documents/delete-anonymous`, 'DELETE', documentRequest);
}
export const deleteDocuments = async (documentRequest: DocumentRequest) => {
    return await requestWithMethod(apiUrl + `/documents`, 'DELETE', documentRequest);
}