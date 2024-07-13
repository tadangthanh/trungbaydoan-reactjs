import { useEffect, useState } from "react";
import { ProjectLinkNotification } from "./CustomeToastNotification";
import { countNotificationNotSeen, getNotificationByUserId, seenAllNotification, seenNotification } from "../../api/notification/NotificationAPI";
import { apiWsUrl, getEmailFromToken, getIdFromToken } from "../../api/CommonApi";
import { NotificationDTO } from "../../model/NotificationDTO";
import { getToken } from "../../api/AuthenticationApi";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import '../css/Notification.css';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";

interface NotificationProps {
    userId: number;
}

export const Notification: React.FC<NotificationProps> = ({ userId }) => {
    const [showNotificationMenu, setShowNotificationMenu] = useState(false);
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [stompClient, setStompClient] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isNewNotification, setIsNewNotification] = useState<boolean>(false);

    useEffect(() => {
        if (isConnected || stompClient) {
            return;
        };
        const socket = new SockJS(`${apiWsUrl}?token=${getToken()}`);
        const client = over(socket);
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };

        client.connect(headers, () => {
            setIsConnected(true);
            setStompClient(client);
            console.log("Đã kết nối với server!!!!!!!!!!!");
            client.subscribe('/user/topic/notification', (data) => {
                const notification = JSON.parse(data.body);
                // notify(notification.projectId, notification.commentId, notification.message, notification.id);
                toast.info(notification.message, { containerId: 'notification' })
                setNotifications(prevNotifications => {
                    const updatedNotifications = [...prevNotifications, notification];
                    return updatedNotifications.sort((a, b) => b.id - a.id);
                });
                setUnreadCount(prevUnreadCount => prevUnreadCount + 1);
                setIsNewNotification(true);
            });
        }, (error) => {
            console.error('không thể kết nối tới websocket:', error);
            setIsConnected(false);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                    setIsConnected(false);
                });
            }
        };
    }, [stompClient, isConnected]);

    const handleNotificationClick = (e: any) => {
        e.preventDefault();
        setShowNotificationMenu(!showNotificationMenu);
    };

    const [page, setPage] = useState(1);
    useEffect(() => {
        getNotificationByUserId(getIdFromToken(), page, 5).then(res => {
            if (res.status === 200) {
                setNotifications(prevNotifications => [...prevNotifications, ...res.data.items]);
                setHasNext(res.data.hasNext);
            } else if (res.status !== 204) {
                toast.error(res.message, { containerId: 'notification' });
            }

        });
    }, [page]);

    useEffect(() => {
        countNotificationNotSeen().then(res => {
            if (res.status === 200) {
                setUnreadCount(res.data);
            } else {
                toast.error(res.message, { containerId: 'notification' });
            }
        });
    }, [notifications]);

    const notify = (projectId: number, commentId: number, message: string, notificationId: number) => toast(
        <ProjectLinkNotification setIsNewNotification={setIsNewNotification} handleSeenNotification={handleSeenNotification} notificationId={notificationId} projectId={projectId} commentId={commentId} message={message} />,
        {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
        }
    );

    const showMoreNotification = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setPage(page + 1);
    };

    const convertDateTime = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    const handleSeenNotification = (id: number) => {
        setUnreadCount(prevUnreadCount => prevUnreadCount - 1);
        seenNotification(id).then(res => {
            if (res.status === 204) {
                setNotifications(prevNotifications => prevNotifications.map(notification => notification.id === id ? { ...notification, seen: true } : notification));
            } else {
                toast.error(res.message, { containerId: 'notification' })
            }
        });
    };
    const handleSeenAll = () => {
        setUnreadCount(0);
        seenAllNotification(getEmailFromToken()).then(res => {
            if (res.status === 204) {
                setNotifications(prevNotifications => prevNotifications.map(notification => ({ ...notification, seen: true })));
            } else {
                toast.error(res.message, { containerId: 'notification' });
            }
        });
    }
    return (
        <div>
            <ToastContainer containerId={`notification`} />
            <div className="notification-menu" onMouseOut={() => setIsNewNotification(false)}>
                <a className={`nav-link ${isNewNotification ? 'blink' : ''}`} href="#" id="notificationToggle" onClick={handleNotificationClick}>
                    <i className="fa-regular fa-bell"></i>
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </a>
                <div className={`dropdown-menu ${showNotificationMenu ? 'show' : ''}`} aria-labelledby="notificationToggle">
                    <div className="dropdown-header">Thông báo | <span onClick={handleSeenAll} style={{ cursor: 'pointer' }}>đánh dấu đã đọc <i className="ms-2 fa-solid fa-check-double"></i></span></div>
                    {notifications.map((notification, index) => (
                        (
                            notification.projectId ?
                                <Link
                                    key={index}
                                    className={notification.seen ? "notification-item " : "notification-item notification-not-seen"}
                                    onClick={notification.seen ? () => { } : () => handleSeenNotification(notification.id)}
                                    to={!notification.commentId ? `/project/${notification.projectId}` : `/project/${notification.projectId}?comment=${notification.commentId}`}
                                >

                                    <i className="fa-solid fa-book"></i>
                                    {notification.message}
                                    <span className="created-date-notification">{convertDateTime(notification.createdDate)}</span>
                                </Link> : <span key={index} className="notification-item ">
                                    <i className="fa-solid fa-book"></i>
                                    {notification.message}
                                    <span className="created-date-notification">{convertDateTime(notification.createdDate)}</span>
                                </span>
                        )
                    ))}
                    {hasNext && (
                        <div onClick={showMoreNotification} className="dropdown-footer text-center">
                            <span>Hiển thị thêm</span>
                        </div>
                    )}
                    {
                        !hasNext && (
                            <div className="dropdown-footer text-center">
                                <span>Không còn thông báo nào</span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};
