import React from "react";
import { Link } from "react-router-dom";
interface ProjectLinkNotificationProps {
    projectId: number,
    message: string,
    commentId: number,
    handleSeenNotification: (notificationId: number) => void
    notificationId: number
    setIsNewNotification: (isNewNotification: boolean) => void
}
export const ProjectLinkNotification: React.FC<ProjectLinkNotificationProps> = ({ setIsNewNotification, notificationId, handleSeenNotification, projectId, commentId, message }) => (
    <div onClick={() => {
        handleSeenNotification(notificationId);
        setIsNewNotification(false);
    }} >
        {commentId === 0 || commentId == null || commentId === undefined ? <Link className="notification-toast" style={{ textDecoration: 'none', color: "black" }} to={`/project/${projectId}`}>{message}</Link> : <Link style={{ textDecoration: 'none', color: "black" }} to={`/project/${projectId}?comment=${commentId}`}>{message}</Link>}
    </div>
);
