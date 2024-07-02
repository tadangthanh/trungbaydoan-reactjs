
import { getToken } from "../AuthenticationApi";
import { getBaseUrl, request } from "../CommonApi";

export async function deleteDocument(documentId: number): Promise<any> {
    const url = getBaseUrl + `/documents/${documentId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete document');
    }

    return await response.json();
};

export const getAllDocumentByProjectId = async (projectId: number) => {
    return await request(getBaseUrl() + `/documents/project/${projectId}`);
}
export const getUrlByDocumentId = async (documentId: number) => {
    return await request(getBaseUrl() + `/documents/blob-url/${documentId}`);
}