import { useState } from "react";
import { CommentDTO } from "../../model/CommentDTO"
import { getEmailFromToken } from "../../api/CommonApi";

interface CommentElementProps {
    comment: CommentDTO,
    convertDateTime: (inputDateTime: string) => string,
    handleReply: (replyTo: string, content: string, receiverEmail: string) => void,

}
export const CommentElement: React.FC<CommentElementProps> = ({ comment, convertDateTime, handleReply }) => {
    const [authorEmail, setAuthorEmail] = useState(getEmailFromToken());
    return (
        <div style={{ margin: '1rem 0 0 1.5rem' }}>
            <div className="flex-grow-1 flex-shrink-1">
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <p className={authorEmail === comment.createdBy ? "mb-1 text-success highlight" : "mb-1"}>
                            {comment.authorName} <span className="small">- {convertDateTime(comment.createdDate)}</span>
                        </p>
                        <button className="btn link-primary" onClick={() => {
                            handleReply("@" + comment.authorName + ": ", comment.content, comment.receiverEmail);
                        }
                        }><i className="fas fa-reply fa-xs"></i><span className="small"> reply</span></button>
                    </div>
                    <p className="small mb-0">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    )
}