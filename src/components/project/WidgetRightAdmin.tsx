import React, { useState } from "react";
import { ProjectDTO } from "../../model/ProjectDTO";
import { approveProjectByIds, deleteProjectByIds, rejectPRojectByIds } from "../../api/projectAPI/ProjectAPI";
import { toast } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';
import { Loading } from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
interface WidgetRightAdminProps {
    setIsEditContent: (isEditContent: boolean) => void;
    isEditContent: boolean;
    handleCancelUpdate: () => void;
    project: ProjectDTO;
    memberRole: string;
    isAdmin: boolean;
}
export const WidgetRightAdmin: React.FC<WidgetRightAdminProps> = ({ isAdmin, memberRole, project, handleCancelUpdate, setIsEditContent, isEditContent }) => {
    const [idReject, setIdReject] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleApprove = (projectId: number) => {
        const result = window.confirm('Bạn có chắc chắn muốn phê duyệt dự án này không?');
        if (result) {
            setLoading(true);
            approveProjectByIds({ projectIds: [projectId], reason: '' }).then(res => {
                if (res.status === 200) {
                    toast.success('Phê duyệt thành công', { containerId: 'project-detail' });
                } else {
                    toast.error('Phê duyệt thất bại', { containerId: 'project-detail' });
                }
            }).finally(() => setLoading(false));
        }

    }
    const handleDeleteProjectByIds = (projectId: number) => {
        const result = window.confirm('Bạn có chắc chắn muốn xóa dự án này không?');
        if (result) {
            setLoading(true);
            deleteProjectByIds({ projectIds: [projectId], reason: '' }).then(res => {
                if (res.status === 200) {
                    // toast.success('Xóa dự án thành công', { containerId: 'project-detail' });
                    navigate('/', { state: { message: 'Xóa dự án thành công' } });

                } else {
                    toast.error('Xóa dự án thất bại', { containerId: 'project-detail' });
                }
            }).finally(() => setLoading(false));
        }
    }
    const handleRejectProjectByIds = (projectId: number) => {
        setIdReject(projectId);
        setShowModal(true);
    }
    const [showModal, setShowModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const handleCloseModal = () => {
        setShowModal(false);
        setIdReject(0);
        setDeleteReason("");
    };
    const handleSubmit = () => {
        setLoading(true);
        rejectPRojectByIds({ projectIds: [idReject], reason: deleteReason }).then(res => {
            if (res.status === 200) {
                toast.success('Từ chối dự án thành công', { containerId: 'project-detail' });
                navigate('/', { state: { message: 'Từ chối dự án thành công' } });
                setShowModal(false);
                setIdReject(0);
                setDeleteReason("");
            } else {
                toast.error('Từ chối dự án thất bại', { containerId: 'project-detail' });
            }
        }).finally(() => setLoading(false));
    }
    return (
        <div className="card mb-4">
            <Loading loading={loading} />
            <div className="card-header"><i className="me-1 fa-solid fa-gear"></i>Chức năng</div>
            <div className="card-body">
                {project.projectStatus === "PENDING" && isAdmin && <button onClick={() => handleApprove(project.id)} className="me-1 mt-1 btn btn-outline-success"><i className="me-1 fa-solid fa-check"></i>Phê duyệt</button>}
                {project.projectStatus === "PENDING" && isAdmin && <button onClick={() => handleRejectProjectByIds(project.id)} className="me-1 mt-1 btn btn-outline-warning"><i className="me-1 fa-regular fa-face-sad-tear"></i>Từ chối</button>}
                {isAdmin && <button onClick={() => handleDeleteProjectByIds(project.id)} className="me-1 mt-1 btn btn-outline-danger"><i className="me-1 fa-solid fa-trash"></i>Xóa</button>}
                {!isEditContent && <button className="mt-1 btn btn-outline-secondary" onClick={() => setIsEditContent(!isEditContent)}><i className="me-1 fa-regular fa-pen-to-square"></i>Edit</button>}
                {isEditContent && <button className="mt-1 btn btn-danger" onClick={handleCancelUpdate}>Hủy<i className="ms-1 fa-regular fa-circle-xmark"></i></button>}

            </div>
            <Modal centered show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa? Từ chối duyệt?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="deleteReason" className="form-label">Lý do:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="deleteReason"
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}