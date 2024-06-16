import { request } from "../CommonApi";
const baseUrl = "http://localhost:8080/api/v1";
export async function findAllTeacherByEmail(email: string): Promise<any> {
    const url = baseUrl + "/users/find-teacher-email?email=" + email;
    const result = request(url);
    return result;
}
export async function findAllStudentByEmail(email: string): Promise<any> {
    const url = baseUrl + "/users/find-student-email?email=" + email;
    const result = request(url);
    return result;
}