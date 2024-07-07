import { useEffect, useState } from "react";
import { ProjectLinkNotification } from "./CustomeToastNotification";
import { countNotificationNotSeen, getNotificationByUserId, seenNotification } from "../../api/notification/NotificationAPI";
import { getEmailFromToken, getIdFromToken } from "../../api/CommonApi";
import { NotificationDTO } from "../../model/NotificationDTO";
import { getToken } from "../../api/AuthenticationApi";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import '../css/Notification.css';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { NotificationElement } from "./NotificationElement";
import '../css/Notification.css';
interface NotificationsProps {
    userId: number;
}

export const Notifications: React.FC<NotificationsProps> = ({ userId }) => {
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
        const socket = new SockJS('http://localhost:8080/ws');
        const client = over(socket);
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };

        client.connect(headers, () => {
            setIsConnected(true);
            setStompClient(client);
            console.log("Đã kết nối với server!!!!!!!!!!!");
            client.subscribe('/topic/notification/' + getEmailFromToken(), (data) => {
                const notification = JSON.parse(data.body);
                notify(notification.projectId, notification.commentId, notification.message, notification.id);
                setNotifications([...notifications, notification]);
                setUnreadCount(unreadCount + 1);
                setIsNewNotification(true);
                // setTimeout(() => setIsNewNotification(false), 5000); // Nhấp nháy trong 5 giây
            });
        }, (error) => {
            console.error('không thể kết nối tới websocket:', error);
            setIsConnected(false);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                    setIsConnected(false);
                    alert("Ngắt kết nối với server");
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
            setNotifications([...notifications, ...res.data.items]);
            setHasNext(res.data.hasNext);
        });
    }, [page]);

    useEffect(() => {
        countNotificationNotSeen().then(res => {
            setUnreadCount(res.data);
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
        setUnreadCount(unreadCount - 1);
        seenNotification(id).then(res => {
            if (res.status === 200) {
                setNotifications(notifications.map(notification => notification.id === id ? { ...notification, seen: true } : notification));
            }
        });
    };
    return (
        <div>
            <ToastContainer />
            <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i style={{ color: '#8e0e0e' }} className={`${isNewNotification ? 'fa-regular fa-bell blink' : 'fa-regular fa-bell'}`}></i>
                <span className="badge badge-danger badge-counter">{unreadCount}</span>
            </a>
            <div style={{ maxHeight: '70vh', overflowY: 'scroll' }} className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
            >
                <h6 className="dropdown-header">
                    Thông báo
                </h6>
                {
                    notifications.map((notification) => (
                        <Link key={notification.id}
                            style={{ textDecoration: 'none' }}
                            onClick={notification.seen ? () => { } : () => handleSeenNotification(notification.id)}
                            to={!notification.commentId ? `/project/${notification.projectId}` : `/project/${notification.projectId}?comment=${notification.commentId}`}
                        >
                            <NotificationElement notification={notification} />
                        </Link>
                    ))
                }

                {hasNext ? <span style={{ cursor: 'pointer' }} onClick={showMoreNotification} className="dropdown-item text-center small text-gray-500">Xem thêm thông báo</span> : <span style={{ cursor: 'pointer' }} className="dropdown-item text-center small text-gray-500">Không còn thông báo nào</span>}
            </div>
        </div >
    );
};
