import Cookies from "js-cookie";
import { getRefreshToken, getToken, setRefreshToken, setToken } from "./AuthenticationApi";
export const getBaseUrl = () => {
    return 'http://localhost:8080/api/v1';
}
export async function request(url: string, retryCount = 0, method = 'GET'): Promise<any> {
    try {
        let response = await fetchWithAuthorization(url, method);
        if (response.status === 403 && retryCount < 1) {
            await refreshTokens();
            return request(url, retryCount + 1);
        }
        return await response.json();
    } catch (error) {
        console.error('url request:', url, 'Failed to make request:', error);
        throw error;
    }
}
export async function requestWithMethod(url: string, method = 'GET', body: any, retryCount = 0): Promise<any> {

    try {
        let response = await fetchWithMethodAuthorization(url, body, method);
        if (response.status === 403 && retryCount < 1) {
            await refreshTokens();
            return requestWithMethod(url, method, body, retryCount + 1);
        }
        return await response.json();
    } catch (error) {
        console.error('url request:', url, 'Failed to make request:', error);
        throw error;
    }
}
export async function requestWithPost(url: string, body: any, retryCount = 0): Promise<any> {
    try {
        let response = await fetchWithPostAuthorization(url, body);
        if (response.status === 403 && retryCount < 1) {
            await refreshTokens();
            return requestWithPost(url, body, retryCount + 1);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to make request post:', error);
        throw error;
    }

}

export async function requestWithPostFile(url: string, body: FormData, retryCount = 0): Promise<any> {
    try {
        let response = await fetchWithPostFileAuthorization(url, body);
        if (response.status === 403 && retryCount < 1) {
            await refreshTokens();
            return requestWithPostFile(url, body, retryCount + 1);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to make request post:', error);
        throw error;
    }

}
async function fetchWithPostFileAuthorization(url: string, body: any) {
    const token = getToken();
    return await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: body,
        method: 'POST'
    });
}
async function fetchWithPostAuthorization(url: string, body: any) {
    const token = getToken();
    return await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'POST'
    });
}
async function fetchWithAuthorization(url: string, method = 'GET') {
    const token = getToken() || '';
    return await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        method: method
    });
}
async function fetchWithMethodAuthorization(url: string, body: any, method = 'GET') {
    console.log("json", JSON.stringify(body));
    const token = getToken() || '';
    return await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        method: method,
        body: JSON.stringify(body)
    });
}

export async function refreshTokens() {
    try {
        const url = "http://localhost:8080/api/v1/auth/refresh";
        const response = await fetch(url, {
            headers: {
                'Refresh-Token': getRefreshToken() as string,
                'Authorization': 'Bearer ' + getToken() as string,
            },
            credentials: 'include',
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const responseData = await response.json(); // Parse JSON response

        const newAccessToken = responseData.data.token;
        const newRefreshToken = responseData.data.refreshToken;
        setToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        if (!newAccessToken || !newRefreshToken) {
            throw new Error('Failed to retrieve new tokens from response data');
        }
    } catch (error) {
        throw new Error('Failed to refresh token');
    }
}
export const getEmailFromToken = (): string => {
    const token = getToken() as string;
    if (!token || token === 'undefined') return '';
    const payload = token?.split('.')[1];
    try {
        return JSON.parse(atob(payload)).sub;
    } catch (error) {
        console.error('Invalid base64 string', error);
        return '';
    }
};
export const getIdFromToken = (): number => {
    const token = getToken() as string;
    if (!token) return 0;
    const payload = token?.split('.')[1];
    try {
        return JSON.parse(atob(payload)).id;
    } catch (error) {
        console.error('Invalid base64 string', error);
        return 0;
    }
}

export const baseAvatarUrl = 'http://localhost:8080/api/v1/users/avatar/view/';
export const verifyToken = async (): Promise<any> => {
    const token = getToken();
    try {
        const url = getBaseUrl() + "/auth/verify-token";
        const response = await fetch(url, {
            headers: { 'Access-Token': token || '' },
            method: 'POST',
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to verify token:', error);
    }
}
export const deleteToken = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
}
