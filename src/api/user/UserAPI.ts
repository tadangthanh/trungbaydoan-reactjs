import { upload } from '@testing-library/user-event/dist/upload';
import { get } from 'jquery';
import { getRefreshToken, getToken } from "../AuthenticationApi";
import { getEmailFromToken, request, requestWithPost, requestWithPostFile } from "../CommonApi";
const baseUrl = "http://localhost:8080/api/v1";
export async function findAllTeacherByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = baseUrl + "/users/find-teacher-email?email=" + email;

    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + getToken() as string
    //     },
    //     body: JSON.stringify(emailsToIgnore)
    // });

    // if (!response.ok) {
    //     throw new Error('Network response was not ok');
    // }

    // const result = await response.json();
    // return result;
    return await requestWithPost(url, emailsToIgnore);
}

export async function findAllStudentByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = baseUrl + "/users/find-student-email?email=" + email;
    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + getToken() as string
    //     },
    //     body: JSON.stringify(emailsToIgnore)
    // });

    // if (!response.ok) {
    //     throw new Error('Network response was not ok');
    // }

    // const result = await response.json();
    // return result;
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