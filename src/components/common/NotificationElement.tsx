import { NotificationDTO } from "../../model/NotificationDTO";

interface NotificationElementProps {
    notification: NotificationDTO;
}
export const NotificationElement: React.FC<NotificationElementProps> = ({ notification }) => {
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
    return (
        <a className="dropdown-item d-flex align-items-center" style={notification.seen ? { background: '#f8f9fa' } : { background: "#f0f8ff" }} href="#">
            <div className="mr-3">
                <div className="icon-circle bg-primary">
                    <i className="fas fa-file-alt text-white"></i>
                </div>
            </div>
            <div>
                <div className="small text-gray-500">{convertDateTime(notification.createdDate)}</div>
                <span className={notification.seen ? "" : "font-weight-bold"}>{notification.message}</span>
            </div>
        </a>
    )
}
