import Cookies from "js-cookie";
import { AuthenticationRequest } from "../model/AuthenticationRequest";
import { UserRegister } from "../model/UserRegister";
import { ResetPassword } from "../model/ResetPassword";
import { apiUrl } from "./CommonApi";


export async function login(request: AuthenticationRequest): Promise<any> {
    const url = apiUrl + "/auth/login";
    const response = await fetch(url, { method: "POST", body: JSON.stringify(request), headers: { "Content-Type": "application/json" } });
    if (!response.ok) {
        console.log(response.statusText);
    };
    const body = await response.json();
    saveTokenAndRefreshToken(body.token, body.refreshToken);
    return body;
}
const saveTokenAndRefreshToken = (token: string, refreshToken: string): void => {
    Cookies.set('token', token, { expires: 7 }); // Token sẽ hết hạn sau 7 ngày
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
}
export const requestResetPassword = async (email: string): Promise<any> => {
    const url = apiUrl + "/users/forgot-password?email=" + email;
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" } });
    if (!response.ok) {
        console.log(response.statusText);
    };
    return await response.json();
}
export const resetPassword = async (resetPassword: ResetPassword): Promise<any> => {
    const url = apiUrl + "/users/reset-password";
    const response = await fetch(url,
        {
            method: "POST",
            body: JSON.stringify(resetPassword),
            headers: {
                "Content-Type": "application/json"
            }
        });
    if (!response.ok) {
        console.log(response.statusText);
    };
    return await response.json();
}
export async function register(request: UserRegister): Promise<any> {
    const url = apiUrl + "/users/register";
    const response = await fetch(url,
        {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        });
    if (!response.ok) {
        console.log(response.statusText);
    };
    return await response.json();
}
export async function verifyEmail(code: string): Promise<any> {
    const url = apiUrl + "/auth/verify?code=" + code;
    const response = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

        });
    if (!response.ok) {
        console.log(response.statusText);
    };
    return await response.json();
}
// Hàm để lấy token từ cookie
export const getToken = (): string | undefined => {
    return Cookies.get('token');
}
export const getRefreshToken = (): string | undefined => {
    return Cookies.get('refreshToken');
}

export const setToken = (token: string): void => {
    Cookies.set('token', token, { expires: 7 });
}
export const setRefreshToken = (refreshToken: string): void => {
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
}