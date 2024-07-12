import { apiUrl, request } from "../CommonApi";

export const getAllAcademyYear = async () => {
    return await request(`${apiUrl}/academy-year`);
}