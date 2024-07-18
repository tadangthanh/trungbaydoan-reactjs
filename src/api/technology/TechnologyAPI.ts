import { apiUrl, request, requestWithPost } from "../CommonApi";

export const getAllTechnology = async () => {
    return await request(`${apiUrl}/technologies`);
}
export const getAllTechnologyByIdIn = async (ids: number[]) => {
    return await requestWithPost(`${apiUrl}/technologies/ids`, ids);
}