import { useNavigate } from "react-router-dom";
import { getRefreshToken, getToken, setRefreshToken, setToken } from "./AuthenticationApi";

export async function request(url: string, retryCount = 0): Promise<any> {
    try {
        let response = await fetchWithAuthorization(url);

        if (response.status === 403 && retryCount < 1) {
            // window.location.href = '/login';
            //Giới hạn số lần thử làm mới token
            const { newAccessToken, newRefreshToken } = await refreshTokens();
            // setToken(newAccessToken);
            // setRefreshToken(newRefreshToken);

            // Thực hiện lại request ban đầu với token mới và tăng số lần thử
            return request(url, retryCount + 1);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to make request:', error);
        throw error;
    }
}

async function fetchWithAuthorization(url: string) {
    const token = getToken();
    return await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
}

export async function refreshTokens(): Promise<{ newAccessToken: string, newRefreshToken: string }> {
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
        setToken(responseData.data.token);
        setRefreshToken(responseData.data.refreshToken);
        const newAccessToken = responseData.data.token;
        const newRefreshToken = responseData.data.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
            throw new Error('Failed to retrieve new tokens from response data');
        }

        return { newAccessToken, newRefreshToken };
    } catch (error) {
        console.error('Failed to refresh tokens:', error);
        throw new Error('Failed to refresh token');
    }
}
export const getEmailFromToken = (): string => {
    const token = getToken() as string;
    const payload = token.split('.')[1];
    try {
        return JSON.parse(atob(payload)).sub;
    } catch (error) {
        console.error('Invalid base64 string', error);
        return '';
    }
};
export async function getRf(): Promise<any> {
    const url = "http://localhost:8080/api/v1/auth/refresh";
    const response = await fetch(url, {
        headers: {
            'Refresh-Token': getRefreshToken() as string,
            'Connection': 'keep-alive',
        },
        method: 'POST'
    });
    console.log("response", response);
    if (!response.ok) {
        throw new Error('Failed to refresh token !!!!!!!!!');
    }
    return await response.json();
}