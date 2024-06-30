import { getRefreshToken, getToken, setRefreshToken, setToken } from "./AuthenticationApi";

export async function request(url: string, retryCount = 0): Promise<any> {
    try {
        let response = await fetchWithAuthorization(url);
        if (response.status === 403 && retryCount < 1) {
            await refreshTokens();
            return request(url, retryCount + 1);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to make request:', error);
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
async function fetchWithAuthorization(url: string) {
    const token = getToken();
    return await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
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
    if (!token) window.location.href = '/login';
    const payload = token.split('.')[1];
    try {
        return JSON.parse(atob(payload)).sub;
    } catch (error) {
        console.error('Invalid base64 string', error);
        return '';
    }
};
