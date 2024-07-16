import { useState } from "react";
import { CommentDTO } from "../../model/CommentDTO"
import { getEmailFromToken } from "../../api/CommonApi";
import { deleteComment } from "../../api/commentAPI/Comment";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../common/LoadingSpinner";

interface CommentElementProps {
    comment: CommentDTO,
    convertDateTime: (inputDateTime: string) => string,
    handleReply: (replyTo: string, content: string, receiverEmail: string, idCommentReply: number) => void,
    setReply: (reply: CommentDTO[]) => void,
    reply: CommentDTO[]
    isLogin: boolean
    idSelected: string

}

export const CommentElement: React.FC<CommentElementProps> = ({ idSelected, isLogin, comment, setReply, reply, convertDateTime, handleReply }) => {
    const [loading, setLoading] = useState(false);
    const [authorEmail, setAuthorEmail] = useState(getEmailFromToken());
    const handleDeleteComment = (id: number) => {
        const result = window.confirm("Bạn muốn xóa bình luận này?");
        if (result) {
            setLoading(true);
            deleteComment(id)
                .then(response => {
                    if (response.status !== 204) {
                        toast.error(response.message, { containerId: 'project-detail' })
                    }
                    toast.success(response.message, { containerId: 'project-detail' })
                    const data = response.data;
                    setReply(reply.filter(comment => comment.id !== id));
                }).finally(() => {
                    setLoading(false);
                })
        }
    }
    const covertToHtml = (content: string) => {
        return { __html: content };
    }

    return (
        <div>
            <Loading loading={loading} />
            <ToastContainer containerId='comment-element' />
            <div className={`comment-child ${idSelected === `${comment.id}` ? 'selected-comment' : ''}`} id={`${comment.id}`}>
                <div className="flex-grow-1 flex-shrink-1">
                    <div>
                        <div className="d-flex justify-content-between align-items-center" style={{ padding: '1rem 0 0 0' }}>
                            <p className={authorEmail === comment.createdBy ? "mb-0 text-success" : "mb-0"}>
                                {comment.authorName} <span className="small time-created-comment"><i className="fa-regular fa-clock"></i> {convertDateTime(comment.createdDate)}</span>
                            </p>

                            {isLogin && <div className="d-flex">
                                <button className="btn link-primary btn-reply" onClick={() => {
                                    handleReply("@" + comment?.authorName + ": ", comment.content, comment.authorEmail, comment.id);
                                }}><i className="fas fa-reply fa-xs"></i><span className="small"> reply</span></button>

                                {authorEmail === comment.createdBy && <div className="d-flex justify-content-end delete-btn" style={{ padding: '0 1rem 0 0' }}>
                                    <i onClick={() => handleDeleteComment(comment.id)} title="Xóa bình luận" className="fa-regular fa-trash-can"></i>
                                </div>}
                            </div>}
                        </div>
                        <div className="small mb-0">
                            <div dangerouslySetInnerHTML={covertToHtml(comment.content)}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}