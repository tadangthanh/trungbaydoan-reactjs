import { apiUrl, request } from "../CommonApi"
export const getNotificationByUserId = async (userId: number, page: number, pageSize: number): Promise<any> => {
    const url = apiUrl + `/notifications/user/${userId}?page=${page}&size=${pageSize}`;
    return await request(url);
}
export const seenNotification = async (notificationId: number): Promise<any> => {
    const url = apiUrl + `/notifications/seen/${notificationId}`;
    return await request(url);
}
export const countNotificationNotSeen = async (): Promise<any> => {
    const url = apiUrl + `/notifications/count-not-seen`;
    return await request(url);
}

