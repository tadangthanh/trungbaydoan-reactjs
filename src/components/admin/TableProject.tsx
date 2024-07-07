import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ProjectDTO } from "../../model/ProjectDTO";
import logo from '../../assets/img/vnua.png';
import { MemberDTO } from "../../model/MemberDTO";
import { Link } from "react-router-dom";
import { DocumentDTO } from '../../model/DocumentDTO';
import { PageResponse } from '../../model/PageResponse';

interface TableProjectProps {
    projects: ProjectDTO[];
    members: MemberDTO[];
    documents: DocumentDTO[];
    setPage: any;
    page: number;
    pageResponse: PageResponse;
}

export const TableProject: React.FC<TableProjectProps> = ({ pageResponse, page, setPage, projects, members, documents }) => {
    const [showModal, setShowModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [actionResult, setActionResult] = useState<string>("");
    const [selectedProjectIdReject, setSelectedProjectIdReject] = useState<number | null>(null);
    const [selectedProjectIdDelete, setSelectedProjectIdDelete] = useState<number | null>(null);


    const handleCloseModal = () => {
        setShowModal(false);
        setDeleteReason("");
        setSelectedProjectIdDelete(null);
        setSelectedProjectIdReject(null);
        setActionResult("Modal Closed");
    };

    const handleSubmit = () => {
        if (selectedProjectIdDelete !== null) {
            console.log("Delete project with ID:", selectedProjectIdDelete, "Reason:", deleteReason);
            // Add your delete API call here
            setShowModal(false);
            setDeleteReason("");
            setSelectedProjectIdDelete(null);
            setActionResult("Delete Submitted");
            return;
        }
        if (selectedProjectIdReject !== null) {
            console.log("Reject project with ID:", selectedProjectIdReject, "Reason:", deleteReason);
            setShowModal(false);
            setDeleteReason("");
            setSelectedProjectIdReject(null);
            setActionResult("Reject Submitted");
            return;
        }
    };

    const convertHtmlToText = (html: string) => {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const convertDateTime = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getMembersByProjectId = (projectId: number): MemberDTO[] => {
        return members.filter(member => member.projectId === projectId);
    };
    const getDocumentsByProjectId = (projectId: number): DocumentDTO[] => {
        return documents.filter(document => document.projectId === projectId);
    }

    const handleDeleteProject = (projectId: number) => {
        setSelectedProjectIdDelete(projectId);
        setShowModal(true);
    };
    const handleRejectProject = (projectId: number) => {
        setSelectedProjectIdReject(projectId);
        setShowModal(true);
    }
    const getDocumentType = (mimeType: string): string => {
        const mimeTypesMap: { [key: string]: string } = {
            'application/msword': 'word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word text-primary',
            'application/vnd.ms-excel': 'Excel Spreadsheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel text-success',
            'application/pdf': 'pdf text-danger'
        };

        return mimeTypesMap[mimeType] || 'file';
    };
    return (
        <>
            <section className="intro">
                <div className="gradient-custom-1 h-100">
                    <div className="mask d-flex align-items-center h-100">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12">
                                    <div className="table-responsive bg-white">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">TÊN ĐỒ ÁN</th>
                                                    <th scope="col">TÓM TẮT</th>
                                                    <th scope="col"><i className="me-1 fa-regular fa-calendar-days"></i>NGÀY NỘP</th>
                                                    <th scope="col">LOẠI</th>
                                                    <th scope="col"><i className="m-1 fa-solid fa-file"> </i>TÀI LIỆU</th>
                                                    <th scope="col"><i className="me-1 fa-regular fa-user"></i>THÀNH VIÊN</th>
                                                    <th scope="col">TRẠNG THÁI</th>
                                                    <th scope="col"><i className="me-1 fa-solid fa-gear"></i>CHỨC NĂNG</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projects.map((project, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">{project.id}</th>
                                                        <td>{convertHtmlToText(project.name)}</td>
                                                        <td>{convertHtmlToText(project.summary)}</td>
                                                        <td>{convertDateTime(project.submissionDate)}</td>
                                                        <td>{project.categoryName}</td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <span role='button' className="no-select item-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="me-1 fa-solid fa-file"></i>Tài liệu
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    {
                                                                        getDocumentsByProjectId(project.id).length === 0 ? <li>Không có tài liệu</li> :
                                                                            getDocumentsByProjectId(project.id).map((document, index) => (

                                                                                <li key={index}><a href={document.url} className="nav-link" style={{ color: "rgb(77 26 26 / 80%)" }} rel="noopener noreferrer" target="_blank"><i className={`me-1 fa-solid fa-file-${getDocumentType(document.mimeType)}`}></i>{document.name}</a></li>
                                                                            ))
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {/* <div className="avatar-group float-start flex-grow-1 task-assigne">
                                                                {getMembersByProjectId(project.id).map((member, index) => (
                                                                    <div key={index} className="avatar-group-item">
                                                                        <Link to={`/profile/${member.email}`} className="d-inline-block"
                                                                            title={member.memberName}
                                                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                                                            aria-label="Terrell Soto"
                                                                            data-bs-original-title="Terrell Soto">
                                                                            <img src={member.avatarUrl ? member.avatarUrl : logo}
                                                                                alt="ảnh đại diện" className="rounded-circle  avatar-sm" />
                                                                        </Link>
                                                                    </div>
                                                                ))}
                                                            </div> */}
                                                            <div className="dropdown">
                                                                <span role='button' className="no-select item-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="me-1 fa-regular fa-user"></i>Thành viên ({getMembersByProjectId(project.id).length})
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    {
                                                                        getMembersByProjectId(project.id).map((member, index) => (

                                                                            <li key={index}>
                                                                                <Link to={`/profile/${member.email}`} className="nav-link d-flex align-items-center">
                                                                                    <img src={member.avatarUrl ? member.avatarUrl : logo}
                                                                                        alt="ảnh đại diện" className="me-1 rounded-circle  avatar-sm" />
                                                                                    {member.memberName}
                                                                                </Link>
                                                                            </li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </div>

                                                        </td>
                                                        <td className={project.projectStatus === "PENDING" ? "text-warning" : project.projectStatus === "APPROVED" ? "text-success" : "text-danger"}>
                                                            <div className="d-flex align-items-center">
                                                                <i className="me-2  fa-solid fa-circle"></i>{project.projectStatus}
                                                            </div>
                                                        </td>
                                                        <td id="function-admin">
                                                            <div className="dropdown">
                                                                <span role='button' className="no-select item-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Chức năng
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    <li><Link to={`/project/${project.id}`} className="nav-link">Xem</Link></li>
                                                                    <li><a href="#" className="nav-link text-danger" onClick={() => handleDeleteProject(project.id)}>Xóa</a></li>
                                                                    <li><a href="#" className="nav-link text-warning" onClick={() => handleRejectProject(project.id)}>Từ chối</a></li>
                                                                    <li><a href="#" className="nav-link">Phê duyệt</a></li>
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nav aria-label="Page navigation example d-flex flex-column align-items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ul className="pagination">
                        <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(1)}>First</a></li>
                        {pageResponse?.data?.currentPage - 1 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 1)}>Previous</a></li>}
                        {pageResponse?.data?.currentPage - 3 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 3)}>{pageResponse?.data?.currentPage - 3}</a></li>}
                        {pageResponse?.data?.currentPage - 2 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 2)}>{pageResponse?.data?.currentPage - 2}</a></li>}
                        {pageResponse?.data?.currentPage - 1 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 1)}>{pageResponse?.data?.currentPage - 1}</a></li>}
                        <li className="page-item active"><a className="page-link" href="#">{pageResponse?.data?.currentPage}</a></li>
                        {pageResponse?.data?.hasNext && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 1)}>{pageResponse?.data?.currentPage + 1}</a></li>}
                        {pageResponse?.data?.currentPage + 2 <= pageResponse?.data?.totalPages && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 2)}>{pageResponse?.data?.currentPage + 2}</a></li>}
                        {pageResponse?.data?.currentPage + 3 <= pageResponse?.data?.totalPages && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 3)}>{pageResponse?.data?.currentPage + 3}</a></li>}
                        {pageResponse?.data?.currentPage + 1 <= pageResponse?.data?.totalPages && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 1)}>Next</a></li>}
                        {pageResponse?.data?.hasNext && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(pageResponse?.data?.totalPages)}>Last</a></li>}
                    </ul>
                </nav>
            </section>

            {/* Delete Confirmation Modal */}
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

            {/* Display action result */}
            {actionResult && (
                <div className="action-result">
                    {actionResult}
                </div>
            )}
        </>
    );
};
