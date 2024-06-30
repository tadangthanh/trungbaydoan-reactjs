import { useEffect, useRef, useState } from "react";
import { CommentDTO } from "../../model/CommentDTO"
import { CommentElement } from "./CommentElement";
import { createComment, getAllCommentChildByParentId } from "../../api/commentAPI/Comment";
import '../css/comment.css';
import { getEmailFromToken } from "../../api/CommonApi";

interface CommentRootProps {
    comment: CommentDTO,
    projectId: number
}
export const CommentRoot: React.FC<CommentRootProps> = ({ comment, projectId }) => {
    function convertDateTime(inputDateTime: string) {
        const date = new Date(inputDateTime);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    }
    const [reply, setReply] = useState<CommentDTO[]>([]);
    const [page, setPage] = useState(0);
    const [hastNext, setHasNext] = useState(true);
    const [idParent, setIdParent] = useState(0);
    const [replyTo, setReplyTo] = useState('');
    const [contentReply, setContentReply] = useState('');
    const [content, setContent] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');
    const replyBoxRef = useRef<HTMLTextAreaElement>(null);
    const [authorEmail, setAuthorEmail] = useState(getEmailFromToken());
    useEffect(() => {
        getAllCommentChildByParentId(comment.id, page, 5)
            .then(response => {
                const data = response.data;
                setHasNext(data.hasNext)
                setReply([...reply, ...data.items]);
            })
            .catch(error => {
                console.log(error);
            });
    }, [page]);
    const handleGetCommentChild = () => {
        setPage(page + 1);
    }
    const handleReply = (replyTo: string, content: string, receiverEmail: string) => {
        setReplyTo(replyTo);
        setIdParent(comment.id);
        setReceiverEmail(receiverEmail);
        setContent(replyTo);
        setContentReply(content)
        setTimeout(() => {
            if (replyBoxRef.current) {
                replyBoxRef.current.focus();
                replyBoxRef.current.setSelectionRange(replyTo.length, replyTo.length);
            }
        }, 100);
    }
    const showLessComment = () => {
        if (reply.length > 5) {
            setReply(prevReply => prevReply.slice(0, prevReply.length - 5));
        } else {
            setHasNext(true);
            setReply([]);
            setPage(0);
        }
    }
    const handleCancelReply = () => {
        setIdParent(0);
        setReplyTo('');
        setContent('');
        setContentReply('');
    }
    const handleAddComment = () => {
        const comment = new CommentDTO(0, content, projectId, '', idParent, '', '', 0, '', '', receiverEmail);
        createComment(comment)
            .then(response => {
                if (response.status !== 200) {
                    console.log(response.message)
                }
                const data = response.data;
                setReply([...reply, data]);
                setIdParent(0);
                setContent('');
            })
            .catch(error => {
                console.log(error);
            });
    }



    return (
        <div className="justify-content-between">
            <div>
                <div className="content-box">
                    <div>
                        <div className="d-flex justify-content-between align-items-center">
                            <p className={authorEmail === comment.createdBy ? "mb-1 text-success highlight" : "mb-1"}>
                                {comment.authorName}  <span className="small"><i className="fa-regular fa-clock"></i> {convertDateTime(comment.createdDate)}</span>
                            </p>
                            <button className="btn link-primary" onClick={() => {
                                handleReply("@" + comment.authorName + ": ", comment.content, comment.receiverEmail);
                            }}><i className="fas fa-reply fa-xs"></i><span className="small"> reply ({comment.totalReply})</span></button>
                        </div>
                        <div>
                            <p className="small mb-0">
                                {comment.content}
                            </p>
                        </div>
                    </div>

                    {
                        reply.map((item, index) => {
                            return <CommentElement
                                key={index} comment={item}
                                convertDateTime={convertDateTime}
                                handleReply={handleReply}
                            />
                        })
                    }

                    <div className="d-flex justify-content-between"> {hastNext && comment.totalReply !== 0 && <button className="pe-auto d-inline-block mt-2 btn link-primary" onClick={handleGetCommentChild}>Xem tất cả </button>}
                        {page !== 0 && <button onClick={showLessComment} className="pe-auto d-inline-block mt-2 btn link-primary">Hiển thị ít hơn</button>}
                    </div>
                </div>
            </div>
            {idParent !== 0 && <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Trả lời <span className="highlight">{replyTo}</span>
                </label>
                <blockquote className="blockquote-comment"><i className="fa-solid fa-quote-left"></i>{contentReply}<i className="fa-solid fa-quote-right"></i>
                </blockquote>
                <textarea className="form-control" value={content} ref={replyBoxRef} onChange={(e) => setContent(e.target.value)} >
                    {replyTo}
                </textarea>
                <button onClick={handleAddComment} className="btn btn-success mt-2">gửi</button>
                <button className="btn btn-secondary mt-2" onClick={handleCancelReply}>Hủy</button>
            </div>}
            <hr />
        </div>
    )
}