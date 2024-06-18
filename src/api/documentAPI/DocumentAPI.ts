import { getToken } from "../AuthenticationApi";

export async function deleteDocument(documentId: number): Promise<any> {
    const url = `http://localhost:8080/api/v1/documents/${documentId}`;
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