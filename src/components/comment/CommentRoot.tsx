import { useEffect, useRef, useState } from "react";
import { CommentDTO } from "../../model/CommentDTO"
import { CommentElement } from "./CommentElement";
import { createComment, deleteComment, getAllCommentChildByParentId } from "../../api/commentAPI/Comment";
import '../css/comment.css';
import { getEmailFromToken, verifyToken } from "../../api/CommonApi";
import { error } from "jquery";

interface CommentRootProps {
    comment: CommentDTO,
    projectId: number,
    setComments: (comments: CommentDTO[]) => void
    comments: CommentDTO[]
    isLogin: boolean
    idSelected: string
}
export const CommentRoot: React.FC<CommentRootProps> = ({ isLogin, comment, projectId, setComments, comments, idSelected }) => {
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
    const replyBoxRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [authorEmail, setAuthorEmail] = useState(getEmailFromToken());
    useEffect(() => {
        getAllCommentChildByParentId(comment.id, page, 5)
            .then(response => {
                const data = response.data;
                setHasNext(data.hasNext)
                setReply([...reply, ...data.items]);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    }, [page]);
    const handleGetCommentChild = () => {
        setPage(page + 1);
        setError('');
        setLoading(true);
    }
    const handleReply = (replyTo: string, content: string, authorEmail: string, idCommentReply: number) => {
        setError('');
        setReplyTo(replyTo);
        setIdParent(comment.id);
        setReceiverEmail(authorEmail);
        setContent(replyTo);
        setContentReply(content)
        setTimeout(() => {
            if (replyBoxRef.current) {
                const link = document.createElement('a');
                link.className = 'highlight text-decoration-none';
                link.href = "#" + idCommentReply.toString();
                link.style.marginRight = '0.5rem';
                link.textContent = replyTo;

                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    replyBoxRef.current?.focus();
                });
                link.addEventListener('keydown', (e) => {
                    console.log(e.key);
                });

                replyBoxRef.current.innerHTML = ' ';
                replyBoxRef.current.appendChild(link);
                // Đặt con trỏ ngay sau thẻ <a>
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStartAfter(link);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);

                replyBoxRef.current.focus();
                replyBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

            }
        }, 100);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        setContent(e.target.innerHTML);
    }
    const showLessComment = () => {
        setError('');
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
    const [error, setError] = useState('');
    const handleAddComment = () => {
        const comment = new CommentDTO(0, content, projectId, '', idParent, 0, '', 0, '', '', receiverEmail);
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
                setError('Có lỗi xảy ra khi thêm bình luận');
                setIdParent(0);
                console.log(error);
            });
    }
    const handleDeleteComment = (id: number) => {
        const result = window.confirm("Bạn muốn xóa bình luận này?");
        if (result) {
            deleteComment(id)
                .then(response => {
                    if (response.status !== 200) {
                        console.log(response.message)
                    }
                    setIdParent(0);
                    setComments(comments.filter(comment => comment.id !== id));
                })
        }
    }
    const convertHmtlToText = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent?.split(":")[1] || "";
    }
    const isHtml = (str: string) => {
        return /<[a-z][\s\S]*>/i.test(str);
    }
    return (
        <div id={`${comment.id}`} className={`justify-content-between ${idSelected === `${comment.id}` ? 'selected-comment' : ''}`}>
            <div>
                <div className="content-box mt-2">
                    <div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <p className={authorEmail === comment.createdBy && isLogin ? "mb-0 text-success" : "mb-0"}>
                                {comment.authorName}  <span className="time-created-comment"><i className="fa-regular fa-clock"></i> {convertDateTime(comment.createdDate)}</span>
                            </p>

                            {isLogin && <div className="d-flex">
                                <button className="btn link-primary" onClick={() => {
                                    handleReply("@" + comment?.authorName + ": ", comment?.content, comment?.authorEmail, comment?.id);
                                }}><i className="fas fa-reply fa-xs"></i><span className="small"> reply ({comment.totalReply})</span></button>

                                {authorEmail === comment.createdBy && <div className="d-flex justify-content-end delete-btn" style={{ padding: '0 1rem 0 0' }}>
                                    <i onClick={() => handleDeleteComment(comment.id)} title="Xóa bình luận" className="fa-regular fa-trash-can"></i>
                                </div>}
                            </div>}
                        </div>
                        <div>
                            <p className="small mb-0">
                                {isHtml(comment.content) ? convertHmtlToText(comment.content) : comment.content}
                            </p>

                        </div>

                    </div>

                    {
                        reply.map((item, index) => {
                            return (item && <CommentElement
                                idSelected={idSelected}
                                isLogin={isLogin}
                                key={index} comment={item}
                                convertDateTime={convertDateTime}
                                handleReply={handleReply}
                                setReply={setReply}
                                reply={reply}
                            />)
                        })
                    }

                    <div className="d-flex justify-content-between"> {hastNext && comment.totalReply !== 0 && <button className="pe-auto d-inline-block mt-2 btn link-primary" onClick={handleGetCommentChild}>Xem tất cả </button>}
                        {loading && <div className="loader"></div>}
                        {page !== 0 && <button onClick={showLessComment} className="pe-auto d-inline-block mt-2 btn link-primary">Hiển thị ít hơn</button>}
                    </div>
                    {idParent !== 0 && <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Trả lời <span className="highlight">{replyTo}</span>
                        </label>
                        <div spellCheck={false} contentEditable id="editableDiv" className="form-control" ref={replyBoxRef} onInput={handleInputChange} >
                        </div>
                        <button onClick={handleAddComment} className="btn btn-success mt-2">gửi</button>
                        <button className="btn btn-secondary mt-2" onClick={handleCancelReply}>Hủy</button>
                    </div>}
                    <span className="text-danger" >{error}</span>
                </div>
            </div>

        </div>
    )
}