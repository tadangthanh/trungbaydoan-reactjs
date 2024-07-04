
import { getEmailFromToken, request, requestWithPost, requestWithPostFile } from "../CommonApi";
import { UpdatePasswordDTO } from '../../model/UpdatePasswordDTO';
const baseUrl = "http://localhost:8080/api/v1";
export async function findAllTeacherByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = baseUrl + "/users/find-teacher-email?email=" + email;
    return await requestWithPost(url, emailsToIgnore);
}

export async function findAllStudentByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = baseUrl + "/users/find-student-email?email=" + email;
    return await requestWithPost(url, emailsToIgnore);
}
export const getUserByEmail = async (email: string) => {
    const url = baseUrl + "/users/email/" + email;
    return await request(url);
}
export const uploadAvatar = async (file: File) => {
    const url = baseUrl + "/users/avatar/" + getEmailFromToken();
    const formData = new FormData();
    formData.append('file', file);
    return await requestWithPostFile(url, formData);
}
export const changePassword = async (userId: number, updatePassword: UpdatePasswordDTO): Promise<any> => {
    const url = baseUrl + `/users/${userId}/change-password`;
    return await requestWithPost(url, updatePassword);
}
export const getCodeVerify = async (email: string) => {
    const url = baseUrl + `/auth/send-code-change-password?email=${email}`;
    return await requestWithPost(url, {});
}