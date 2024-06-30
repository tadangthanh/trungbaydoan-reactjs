import { useEffect, useState } from "react";
import { CommentDTO } from "../../model/CommentDTO";
import { createComment, getAllCommentByProjectId } from "../../api/commentAPI/Comment";
import { CommentRoot } from "./CommentRoot";

export const Comment = () => {
    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [content, setContent] = useState('');
    const [parentCommentId, setParentCommentId] = useState(0);
    const [page, setPage] = useState(1);
    const [hastNext, setHasNext] = useState(true);
    useEffect(() => {
        getAllCommentByProjectId(23, page, 5)
            .then(response => {
                const data = response.data;
                console.log(data.items)
                setComments(data.items);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        getAllCommentByProjectId(23, page, 5)
            .then(response => {
                const data = response.data;
                setHasNext(data.hasNext)
                setComments([...comments, ...data.items]);
            })
            .catch(error => {
                console.log(error);
            });
    }, [page]);
    const getAllComment = () => {
        setPage(page + 1);
    }
    const handleAddComment = () => {
        const comment = new CommentDTO(0, content, 23, '', parentCommentId, '', '', 0, '', '', '');
        createComment(comment)
            .then(response => {
                if (response.status !== 200) {
                    console.log(response.message)
                }
                const data = response.data;
                setComments([...comments, data]);
                setContent('');
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <section className="gradient-custom">
            <div className="container my-5 py-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-12 col-lg-10 col-xl-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h4 className="text-center mb-4 pb-2">Nested comments section</h4>
                                {comments.map((comment, index) => (
                                    <CommentRoot
                                        key={index}
                                        projectId={23}
                                        comment={comment}
                                    />
                                ))}
                            </div>

                        </div>
                        <div className="d-flex justify-content-between"> {hastNext && <button className="pe-auto d-inline-block mt-2 btn link-primary" onClick={getAllComment}>Xem thêm bình luận</button>}
                        </div>
                        <label htmlFor="yourComment"> Bình luận của bạn </label>
                        <textarea placeholder="Nhập bình luận..." id="yourComment" className="form-control" value={content} onChange={(e) => setContent(e.target.value)} >
                        </textarea>
                        <button onClick={handleAddComment} className="btn btn-success mt-2">gửi</button>
                    </div>
                </div>
            </div>
        </section>
    )
}