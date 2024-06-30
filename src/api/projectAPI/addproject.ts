import { ProjectCreate } from "../../model/ProjectCreate";
import { getToken } from "../AuthenticationApi";
import { request, requestWithPost } from "../CommonApi";

const baseUrl = "http://localhost:8080/api/v1";
export async function getAllCategory(): Promise<any> {
    const url = baseUrl + "/categories";
    const result = request(url);
    return result;
}

export async function createProject(project: ProjectCreate): Promise<any> {
    const url = baseUrl + "/projects";
    const token = getToken();
    const response = requestWithPost(url, project);
    return response;
}