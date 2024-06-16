import { ProjectCreate } from "../../model/ProjectCreate";
import { getToken } from "../AuthenticationApi";
import { request } from "../CommonApi";

const baseUrl = "http://localhost:8080/api/v1";
export async function getAllCategory(): Promise<any> {
    const url = baseUrl + "/categories";
    const result = request(url);
    return result;
}

export async function createProject(project: ProjectCreate): Promise<any> {
    const url = baseUrl + "/projects/group/5";
    const token = getToken();
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(project),
    });
    return await response.json();
}