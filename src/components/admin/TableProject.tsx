import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ProjectDTO } from "../../model/ProjectDTO";
import logo from '../../assets/img/vnua.png';
import { MemberDTO } from "../../model/MemberDTO";
import { Link } from "react-router-dom";
import { DocumentDTO } from '../../model/DocumentDTO';
import { PageResponse } from '../../model/PageResponse';
import { activeProjectByIds, approveProjectByIds, deleteProjectByIds, getAllProjectByAdmin, getDocumentsByProjectIds, getMembersByProjectIds, inactiveProjectByIds, rejectPRojectByIds } from '../../api/projectAPI/ProjectAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loading } from '../common/LoadingSpinner';

export const TableProject: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteReason, setDeleteReason] = useState("");
    const [actionResult, setActionResult] = useState<string>("");
    const [selectedProjectIdReject, setSelectedProjectIdReject] = useState<number | null>(null);
    const [selectedProjectIdDelete, setSelectedProjectIdDelete] = useState<number | null>(null);
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("")
    const [searchField, setSearchField] = useState("")
    const [documents, setDocuments] = useState<DocumentDTO[]>([])
    const [direction, setDirection] = useState("DESC")
    const [pageResponse, setPageResponse] = useState({} as PageResponse);
    const [size, setSize] = useState(5);
    const [idsSelected, setIdsSelected] = useState<number[]>([]);
    const [isSelect, setIsSelect] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isReject, setIsReject] = useState(false);
    const checkboxRefs = useRef<HTMLInputElement[]>([]);
    const selectAllInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        handleUnSelectAll();
        getAllData();
    }, [page, search, direction, size]);
    const getAllData = () => {
        setLoading(true);
        getAllProjectByAdmin(page, size, "id", direction, searchField, search).then(res => {
            if (res.status === 200) {
                setPageResponse(res);
                setProjects(res.data.items);
                const projectIds = res.data.items.map((project: ProjectDTO) => project.id);
                getMembersByProjectIds(projectIds).then(res => {
                    if (res.status === 200) {
                        setMembers(res.data);
                    }
                    setLoading(false);
                });
                getDocumentsByProjectIds(projectIds).then(res => {
                    if (res.status === 200) {
                        setDocuments(res.data);
                    }
                    setLoading(false);
                });
            } else {
                toast.error(res.message, { containerId: 'table-project-admin' })
                setLoading(false);
            }
        })
    }
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setIsSelect(isChecked);
        setIdsSelected(isChecked ? projects.map(project => project.id) : []);
        checkboxRefs.current.forEach(checkbox => {
            if (checkbox) checkbox.checked = isChecked;
        });
    };
    useEffect(() => {
        checkboxRefs.current.forEach(checkbox => {
            checkbox?.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (idsSelected.filter(id => id !== +checkbox.value).length === 0) {
                        setIdsSelected(pre => [...pre.filter(id => id !== +checkbox.value), +checkbox.value])
                        setIsSelect(true)
                    }
                } else {
                    setIdsSelected(pre => pre.filter(id => id !== +checkbox.value))
                    if (idsSelected.filter(id => id !== +checkbox.value).length === 1) {
                        setIsSelect(false)
                    }
                }
            });
        });
    }, [projects]);

    const handleUnSelectAll = () => {
        setIsSelect(false);
        selectAllInput.current && (selectAllInput.current.checked = false);
        setIdsSelected([]);
        checkboxRefs.current.forEach(checkbox => {
            if (checkbox) checkbox.checked = false;
        });
    };

    const searchRef = React.createRef<HTMLInputElement>();
    const handleSearch = (e: any) => {
        e.preventDefault();
        setSearchField("name")
        setSearch(searchRef.current?.value || "");
    }
    const handleFilter = (e: any) => {
        setSearchField("projectStatus")
        setSearch(e.target.value);
    }
    const handleSort = (e: any) => {
        setDirection(e.target.value);
    }
    const handleSetSize = (e: any) => {
        setSize(e.target.value);
    }
    const handleShow = (e: any) => {
        setSearch(e.target.value)
        setSearchField("active")
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setDeleteReason("");
        setActionResult("Modal Closed");
    };


    const handleSubmit = () => {
        if (idsSelected.length > 0) {
            if (isDelete) {
                setLoading(true);
                deleteProjectByIds({ projectIds: idsSelected, reason: deleteReason }).then(res => {
                    if (res.status === 200) {
                        toast.success(res.message, { containerId: 'table-project-admin' })
                        setProjects(projects.filter(project => !idsSelected.includes(project.id)));
                        setMembers(members.filter(member => !idsSelected.includes(member.projectId)));
                        setDocuments(documents.filter(document => !idsSelected.includes(document.projectId)));
                        setIsSelect(false);
                        handleUnSelectAll();
                    } else {
                        toast.error(res.message, { containerId: 'table-project-admin' })
                    }
                    setLoading(false);
                });
                setIsDelete(false);
                setShowModal(false);
                setDeleteReason("");
                setIdsSelected([]);
                setLoading(false);
                return;
            }
            if (isReject) {
                setLoading(true);
                rejectPRojectByIds({ projectIds: idsSelected, reason: deleteReason }).then(res => {
                    if (res.status === 200) {
                        setProjects(pre => pre.map(project => idsSelected.includes(project.id) ? { ...project, projectStatus: "REJECTED" } : project))
                        setIsSelect(false);
                        handleUnSelectAll()
                        toast.success(res.message, { containerId: 'table-project-admin' })
                    } else {
                        toast.error(res.message, { containerId: 'table-project-admin' })
                    }
                    setLoading(false);
                });
                setIsReject(false);
                setShowModal(false);
                setDeleteReason("");
                setIdsSelected([]);
                setLoading(false);
                return;
            }

        }
        setIsDelete(false);
        setIsReject(false);
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
        setIdsSelected([projectId]);
        setIsSelect(false);
        setSelectedProjectIdDelete(projectId);
        setIsDelete(true);
        setShowModal(true);
    };
    const handleRejectProject = (projectId: number) => {
        setIdsSelected([projectId]);
        setIsSelect(false)
        setIsReject(true);
        setSelectedProjectIdReject(projectId);
        setShowModal(true);
    }
    const handleApproveProject = (projectId: number) => {
        handleApprove([projectId], "");
        setIsReject(false);
    }
    const handleApprove = (projectIds: number[], reason: string) => {
        setLoading(true);
        approveProjectByIds({ projectIds: projectIds, reason: reason }).then(res => {
            if (res.status === 200) {
                setProjects(pre => pre.map(project => projectIds.includes(project.id) ? { ...project, projectStatus: "APPROVED" } : project))
                setIsSelect(false);
                handleUnSelectAll()
                toast.success(res.message, { containerId: 'table-project-admin' })
            } else {
                toast.error(res.message, { containerId: 'table-project-admin' })
            }
            setLoading(false);
        });
    }
    const handleDeleteSelected = () => {
        if (idsSelected.length === 0) return;
        setIsDelete(true);
        setIsReject(false);
        setShowModal(true);
    }

    const handleRejectSelected = () => {
        if (idsSelected.length === 0) return;
        setIsReject(true);
        setIsDelete(false);
        setShowModal(true);
    }
    const handleApproveSelected = () => {
        handleApprove(idsSelected, "");
        setIsReject(false);
        setIsDelete(false);
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

    const handleActive = (projectId: number) => {
        setLoading(true);
        activeProjectByIds({ projectIds: [projectId], reason: "" }).then(res => {
            if (res.status === 200) {
                setProjects(pre => pre.map(project => project.id === projectId ? { ...project, active: true } : project))
                toast.success(res.message, { containerId: 'table-project-admin' })
            } else {
                toast.error(res.message, { containerId: 'table-project-admin' })
            }
            setLoading(false);
        });
    }
    const handleInactive = (projectId: number) => {
        setLoading(true);
        inactiveProjectByIds({ projectIds: [projectId], reason: "" }).then(res => {
            if (res.status === 200) {
                setProjects(pre => pre.map(project => project.id === projectId ? { ...project, active: false } : project))
                toast.success(res.message, { containerId: 'table-project-admin' })
            } else {
                toast.error(res.message, { containerId: 'table-project-admin' })
            }
            setLoading(false);
        });
    }

    return (
        <div className="content container">
            <Loading loading={loading} />
            <ToastContainer containerId='table-project-admin' />
            <nav className="navbar navbar-expand-lg navbar-light ">
                <div className="container-fluid">
                    <span className="navbar-brand">Danh sách đồ án</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarScroll">
                        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" >
                            <li className="nav-item">
                                <label htmlFor='admin-filter-select' className="nav-link">
                                    <i className="me-1 fa-solid fa-filter"></i>Trạng thái
                                </label>
                                <select name="" onChange={handleFilter} id="admin-filter-select">
                                    <option value="">Tất cả</option>
                                    <option value="PENDING">Đợi duyệt</option>
                                    <option value="APPROVED">Đã duyệt</option>
                                    <option value="REJECTED">Bị từ chối</option>
                                </select>
                            </li>
                            <li className="nav-item">
                                <label htmlFor='admin-sort' className="nav-link">
                                    <i className="ms-2 me-1 fa-solid fa-sort"></i>Xắp xếp
                                </label>
                                <select name="" onChange={handleSort} id="admin-sort">
                                    <option value="DESC">Mới nhất</option>
                                    <option value="ASC">Cũ nhất</option>
                                </select>
                            </li>
                            <li className="nav-item">
                                <label htmlFor='admin-sort' className="nav-link">
                                    <i className="ms-2 me-1 fa-solid fa-sort"></i>Số bản ghi
                                </label>
                                <select name="" defaultValue={size} onChange={handleSetSize} id="admin-sort">
                                    {[5, 10, 15, 20, 30, 50].map((s) =>
                                        <option key={s} value={s}>{s}</option>)
                                    }
                                </select>
                            </li>
                            <li className="nav-item">
                                <label htmlFor='admin-sort' className="nav-link">
                                    <i className="ms-2 me-1 fa-solid fa-sort"></i>Hiển thị
                                </label>
                                <select name="" onChange={handleShow}>
                                    <option value="1">Hiện</option>
                                    <option value="0">Ẩn</option>
                                </select>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <input ref={searchRef} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button onClick={handleSearch} className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
            {isSelect && idsSelected.length > 0 &&
                <div style={{ paddingLeft: '0.75rem' }}>
                    <button onClick={handleDeleteSelected} style={{ fontSize: '0.8rem' }} className='btn btn-danger'><i className="me-1 fa-regular fa-trash-can"></i>Xoá</button>
                    <button onClick={handleApproveSelected} style={{ fontSize: '0.8rem' }} className='btn btn-success'><i className="me-1 fa-solid fa-check"></i>Phê duyệt</button>
                    <button onClick={handleRejectSelected} style={{ fontSize: '0.8rem' }} className='btn btn-warning'><i className="me-1 fa-regular fa-face-sad-tear"></i>Từ chối</button>
                </div>
            }
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
                                                        <th scope="col"><input ref={selectAllInput} onChange={handleSelectAll} type="checkbox" /></th>
                                                        <th scope="col">ID</th>
                                                        <th scope="col">TÊN ĐỒ ÁN</th>
                                                        <th scope="col">TÓM TẮT</th>
                                                        <th scope="col"><i className="me-1 fa-regular fa-calendar-days"></i>NGÀY NỘP</th>
                                                        <th scope="col">LOẠI</th>
                                                        <th scope="col"><i className="m-1 fa-solid fa-file"> </i>TÀI LIỆU</th>
                                                        <th scope="col"><i className="me-1 fa-regular fa-user"></i>THÀNH VIÊN</th>
                                                        <th scope="col">TRẠNG THÁI</th>
                                                        <th scope="col">HIỂN THỊ</th>
                                                        <th scope="col"><i className="me-1 fa-solid fa-gear"></i>CHỨC NĂNG</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {projects.map((project, index) => (
                                                        <tr key={index}>
                                                            <td><input ref={el => (checkboxRefs.current[index] = el!)} value={project.id} onChange={
                                                                (e) => {
                                                                    idsSelected.length === projects.length && setIsSelect(true)

                                                                }
                                                            } type="checkbox" /></td>
                                                            <td scope="row">{project.id}</td>
                                                            <td><p className='text-clamp'>{convertHtmlToText(project.name)}</p></td>
                                                            <td><p className='text-clamp'>{convertHtmlToText(project.summary)}</p></td>
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
                                                            <td>
                                                                <div className="dropdown">
                                                                    <span role='button' className="no-select item-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        {project.active ? "Hiện" : "Ẩn"}
                                                                    </span>
                                                                    <ul className="dropdown-menu">
                                                                        <li><a href="#" onClick={() => handleInactive(project.id)} className="nav-link"><i className="me-1 fa-regular fa-eye-slash"></i>Ẩn</a></li>
                                                                        <li><a href="#" onClick={() => handleActive(project.id)} className="nav-link"><i className="me-1 fa-regular fa-eye"></i>Hiện</a></li>
                                                                    </ul>
                                                                </div>

                                                            </td>
                                                            <td id="function-admin">
                                                                <div className="dropdown">
                                                                    <span role='button' className="no-select item-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        Chức năng
                                                                    </span>
                                                                    <ul className="dropdown-menu">
                                                                        <li><Link to={`/project/${project.id}`} className="nav-link"><i className="me-1 fa-regular fa-eye"></i>Xem</Link></li>
                                                                        <li><a href="#" className="nav-link text-danger" onClick={() => handleDeleteProject(project.id)}><i className="me-1 fa-solid fa-trash"></i>Xóa</a></li>
                                                                        <li><a href="#" className="nav-link text-warning" onClick={() => handleRejectProject(project.id)}><i className="me-1 fa-regular fa-face-sad-tear"></i>Từ chối</a></li>
                                                                        <li><a href="#" onClick={() => handleApproveProject(project.id)} className="nav-link"><i className="me-1 fa-solid fa-check"></i>Phê duyệt</a></li>
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
                            {pageResponse?.data?.currentPage - 1 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(1)}>First</a></li>}
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
        </div>

    );
};
