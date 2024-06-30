import { getRefreshToken, getToken } from "../AuthenticationApi";
import { request } from "../CommonApi";
const baseUrl = "http://localhost:8080/api/v1";
export async function findAllTeacherByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = baseUrl + "/users/find-teacher-email?email=" + email;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken() as string
        },
        body: JSON.stringify(emailsToIgnore)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
}

export async function findAllStudentByEmail(email: string, emailsToIgnore: string[]): Promise<any> {
    const url = baseUrl + "/users/find-student-email?email=" + email;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken() as string
        },
        body: JSON.stringify(emailsToIgnore)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
}