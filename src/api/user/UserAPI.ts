
import { apiUrl, getEmailFromToken, request, requestWithPost, requestWithPostFile } from "../CommonApi";
import { UpdatePasswordDTO } from '../../model/UpdatePasswordDTO';
export async function findAllTeacherByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = apiUrl + "/users/find-teacher-email?email=" + email;
    return await requestWithPost(url, emailsToIgnore);
}

export async function findAllStudentByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = apiUrl + "/users/find-student-email?email=" + email;
    return await requestWithPost(url, emailsToIgnore);
}
export const getUserByEmail = async (email: string) => {
    const url = apiUrl + "/users/email/" + email;
    return await request(url);
}
export const uploadAvatar = async (file: File) => {
    const url = apiUrl + "/users/avatar/" + getEmailFromToken();
    const formData = new FormData();
    formData.append('file', file);
    return await requestWithPostFile(url, formData);
}
export const changePassword = async (userId: number, updatePassword: UpdatePasswordDTO): Promise<any> => {
    const url = apiUrl + `/users/${userId}/change-password`;
    return await requestWithPost(url, updatePassword);
}
export const getCodeVerify = async (email: string) => {
    const url = apiUrl + `/auth/send-code-change-password?email=${email}`;
    return await requestWithPost(url, {});
}
export const updateProfile = async (userId: number, userUpdateDTO: any): Promise<any> => {
    const url = apiUrl + `/users/${userId}`;
    return await requestWithPost(url, userUpdateDTO);
}
export const getAllUserByAdmin = async (page: number, pageSize: number, sortBy = 'id', direction = "DESC", searchField = "", search = "") => {
    return await request(`${apiUrl}/admin/users?page=${page}&size=${pageSize}&sort=${sortBy}&direction=${direction}&searchField=${searchField}&search=${search}`);
}
export const inactiveUserByIds = async (id: number) => {
    return await request(`${apiUrl}/users/inactive/${id}`, "POST");
}
export const activeUserByIds = async (id: number) => {
    return await request(`${apiUrl}/users/active/${id}`, "POST");
}