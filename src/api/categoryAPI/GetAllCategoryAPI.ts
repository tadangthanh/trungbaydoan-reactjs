import { request } from "../CommonApi";

const baseUrl = "http://localhost:8080/api/v1";

export async function getAllCategory(): Promise<any> {
    const url = baseUrl + "/categories";
    const result = request(url);
    return result;
}