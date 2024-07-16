import { useEffect, useRef, useState } from "react";
import { CommentDTO } from "../../model/CommentDTO"
import { CommentElement } from "./CommentElement";
import { createComment, deleteComment, getAllCommentChildByParentId } from "../../api/commentAPI/Comment";
import '../css/comment.css';
import { getEmailFromToken } from "../../api/CommonApi";
import logo from '../../assets/img/fita.png';
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../common/LoadingSpinner";
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
    const [page, setPage] = useState(1);
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
        setLoading(true);
        getAllCommentChildByParentId(comment.id, page, 5)
            .then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    setHasNext(data.hasNext)
                    setReply([...reply, ...data.items]);
                } else if (response.status !== 204) {
                    toast.error(response.message, { containerId: 'comment-root' })
                }
            }).finally(() => {
                setLoading(false);
            })
    }, [page]);
    const handleGetCommentChild = () => {
        setPage(page + 1);
        setError('');
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
            setPage(1);
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
        setLoading(true);
        const comment = new CommentDTO(0, content, projectId, '', idParent, 0, '', 0, '', '', receiverEmail, '');
        createComment(comment)
            .then(response => {
                if (response.status !== 201) {
                    toast.error(response.message, { containerId: 'comment-root' })
                }
                const data = response.data;
                setReply([...reply, data]);
                setIdParent(0);
                setContent('');
            })
            .catch(error => {
                setError('Có lỗi xảy ra khi thêm bình luận');
                toast.error('Có lỗi xảy ra khi thêm bình luận', { containerId: 'comment-root' })
                setIdParent(0);
            }).finally(() => {
                setLoading(false);
            });
    }
    const handleDeleteComment = (id: number) => {
        const result = window.confirm("Bạn muốn xóa bình luận này?");
        if (result) {
            setLoading(true);
            deleteComment(id)
                .then(response => {
                    if (response.status !== 200) {
                        toast.error(response.message, { containerId: 'comment-root' })
                    }
                    setIdParent(0);
                    setComments(comments.filter(comment => comment.id !== id));
                }).finally(() => {
                    setLoading(false);
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
            <Loading loading={loading} />
            <ToastContainer containerId='comment-root' />
            <div>
                <div className="content-box mt-2">
                    <div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <div className="d-flex align-items-center">
                                <img src={comment.authorAvatarUrl ? comment.authorAvatarUrl : logo}
                                    alt="ád" className="me-1 rounded-circle avatar-sm" />
                                <p className="mb-0" >
                                    <Link className={authorEmail === comment.createdBy && isLogin ? "text-success text-decoration-none" : "text-decoration-none"} to={`/profile/${comment.authorEmail}`}> {comment.authorName}</Link>

                                </p>
                            </div>

                            {isLogin && <div className="d-flex">
                                <button className="btn link-primary" onClick={() => {
                                    handleReply("@" + comment.authorName + ": ", comment.content, comment.authorEmail, comment.id);
                                }}><i className="fas fa-reply fa-xs"></i><span className="small"> reply ({comment.totalReply})</span></button>

                                {authorEmail === comment.createdBy && <div className="d-flex justify-content-end delete-btn" style={{ padding: '0 1rem 0 0' }}>
                                    <i onClick={() => handleDeleteComment(comment.id)} title="Xóa bình luận" className="fa-regular fa-trash-can"></i>
                                </div>}
                            </div>}
                        </div>
                        <div >
                            <p className="small mb-0">
                                <i className="me-2 fa-solid fa-bullhorn"></i> {isHtml(comment.content) ? convertHmtlToText(comment.content) : comment.content}
                            </p>
                            <span className="time-created-comment"><i className="ms-2 fa-regular fa-clock"></i> {convertDateTime(comment.createdDate)}</span>

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
                        {page !== 1 && <button onClick={showLessComment} className="pe-auto d-inline-block mt-2 btn link-primary">Hiển thị ít hơn</button>}
                    </div>
                    {idParent !== 0 && <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Trả lời <span className="highlight">{replyTo}</span>
                        </label>
                        <div spellCheck={false} contentEditable id="editableDiv" className="form-control" ref={replyBoxRef} onInput={handleInputChange} >
                        </div>
                        <button onClick={handleAddComment} className="btn me-2 btn-success mt-2"><i className="me-2 fa-regular fa-paper-plane"></i>gửi</button>
                        <button className="btn btn-secondary mt-2" onClick={handleCancelReply}>Hủy</button>
                    </div>}
                    <span className="text-danger" >{error}</span>
                </div>
            </div>

        </div>
    )
}