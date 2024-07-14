import { useEffect, useState } from "react";
import { CommentDTO } from "../../model/CommentDTO";
import { createComment, getAllCommentByProjectId, getCommentByCommentIdAndProjectId } from "../../api/commentAPI/Comment";
import { CommentRoot } from "./CommentRoot";
import { useLocation } from "react-router-dom";
import { verifyToken } from "../../api/CommonApi";
import { toast, ToastContainer } from "react-toastify";
interface CommentProps {
    projectId: number;
}
export const Comment: React.FC<CommentProps> = ({ projectId }) => {
    const location = useLocation();
    const [idSelected, setIdSelected] = useState('');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const commentId = searchParams.get('comment');
        setIdSelected(commentId || '');
        if (Number(commentId) > 0 && comments.filter(comment => comment.id !== Number(commentId)).length === comments.length) {
            const myElement = document.getElementById(commentId || '');
            myElement?.setAttribute('style', '');
            getCommentByCommentIdAndProjectId(Number(commentId), projectId).then(response => {
                if (response.status !== 200) {
                    toast.error(response.message)
                    return;
                }
                setComments([...comments, response.data]);
            });
            setTimeout(() => {
                const myElement = document.getElementById(commentId || '');
                myElement?.setAttribute('style', 'background-color:#fdeded');
                if (myElement) {
                    myElement.scrollIntoView();
                }
            }, 1000);
        }
    }, [location]);


    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [content, setContent] = useState('');
    const [parentCommentId, setParentCommentId] = useState(0);
    const [page, setPage] = useState(1);
    const [hastNext, setHasNext] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        getAllCommentByProjectId(projectId, page, 5)
            .then(response => {
                const data = response.data;
                if (response.status === 200) {
                    setHasNext(data.hasNext)
                    setComments([...comments, ...data.items]);
                } else if (response.status !== 204) {
                    toast.error(response.message, { containerId: 'comment' })
                    setHasNext(false)
                    return;
                }

            })
    }, [page]);
    const getAllComment = () => {
        setPage(page + 1);
    }
    const handleAddComment = () => {
        const comment = new CommentDTO(0, content, projectId, '', parentCommentId, 0, '', 0, '', '', '', '');
        createComment(comment)
            .then(response => {
                if (response.status !== 201) {
                    toast.error(response.message, { containerId: 'comment' })
                    setError('Không thể thêm bình luận');
                }
                setError('');
                const data = response.data;
                setComments([...comments, data]);
                setContent('');
            })
    }
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
            }
        });
    }, []);
    return (
        <div>
            <ToastContainer containerId='comment' />
            <div className="card">
                <div className="card-body p-4">
                    <h4 className="text-center mb-4 pb-2">Bình luận<i className="ms-2 fa-solid fa-comment"></i></h4>
                    {comments.map((comment, index) => (
                        <CommentRoot
                            isLogin={isLogin}
                            key={index}
                            projectId={projectId}
                            comment={comment}
                            comments={comments}
                            idSelected={idSelected}
                            setComments={setComments}
                        />
                    ))}
                </div>

            </div>
            <div className="d-flex justify-content-between">
                {hastNext && comments.length > 0 && <button className="pe-auto d-inline-block mt-2 btn link-primary" onClick={getAllComment}>Xem thêm bình luận</button>}
                <span className="text-danger">{error}</span>
            </div>
            <label htmlFor="yourComment"> Bình luận của bạn: </label>
            {!isLogin && <textarea placeholder="Vui lòng đăng nhập để bình luận" id="yourComment" className="form-control" disabled />}
            {isLogin && <textarea placeholder="Nhập bình luận..." id="yourComment" className="form-control" value={content} onChange={(e) => { setContent(e.target.value); setError('') }} >
            </textarea>
            }
            {isLogin && <button onClick={handleAddComment} disabled={content.trim() == ''} className="btn btn-success mt-2"><i className="me-2 fa-regular fa-paper-plane"></i>gửi</button>}
        </div>
    )
}