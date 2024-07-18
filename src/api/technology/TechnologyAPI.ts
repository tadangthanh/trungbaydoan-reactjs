import { apiUrl, request } from "../CommonApi";

export const getAllTechnology = async () => {
    return await request(`${apiUrl}/technologies`);
}