import { getToken } from "../AuthenticationApi";

export async function request(url: string) {
    const token = getToken();
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log("ASD");
    return await response.json();
}
