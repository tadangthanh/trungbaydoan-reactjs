import { Category } from "../../model/Category";
import { apiUrl, request, requestWithPost } from "../CommonApi";

export async function getAllCategory(): Promise<any> {
    const url = apiUrl + "/categories";
    // console.log("url", url);

    return await request(url);
}
export const createCategory = async (category: Category) => {
    return await requestWithPost(apiUrl + "/categories", category);
}
export const deleteCategory = async (id: number) => {
    return await request(apiUrl + "/categories/" + id, "DELETE");
}
