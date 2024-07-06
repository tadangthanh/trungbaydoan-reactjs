import { getBaseUrl, request } from "../CommonApi"

const baseUrl = getBaseUrl();
export const getNotificationByUserId = async (userId: number, page: number, pageSize: number): Promise<any> => {
    const url = baseUrl + `/notifications/user/${userId}?page=${page}&size=${pageSize}`;
    return await request(url);
}
export const seenNotification = async (notificationId: number): Promise<any> => {
    const url = baseUrl + `/notifications/seen/${notificationId}`;
    return await request(url);
}
export const countNotificationNotSeen = async (): Promise<any> => {
    const url = baseUrl + `/notifications/count-not-seen`;
    return await request(url);
}

