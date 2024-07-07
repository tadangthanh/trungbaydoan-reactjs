import React, { useEffect, useState } from 'react';
import '../css/Admin.css';
import { Table } from '@mui/material';
import { TableProject } from './TableProject';
import { Link } from 'react-router-dom';
import { ProjectDTO } from '../../model/ProjectDTO';
import { getAllProjectByAdmin, getDocumentsByProjectIds, getMembersByProjectIds } from '../../api/projectAPI/ProjectAPI';
import { verifyToken } from '../../api/CommonApi';
import { MemberDTO } from '../../model/MemberDTO';
import { DocumentDTO } from '../../model/DocumentDTO';
import { PageResponse } from '../../model/PageResponse';
interface AdminProps {
    startLoading: () => void;
    stopLoading: (success: boolean, message: string) => void;
}
export const Admin: React.FC<AdminProps> = ({ startLoading, stopLoading }) => {
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("")
    const [searchField, setSearchField] = useState("")
    const [documents, setDocuments] = useState<DocumentDTO[]>([])
    const [direction, setDirection] = useState("DESC")
    const [pageResponse, setPageResponse] = useState({} as PageResponse);
    const [size, setSize] = useState(10);
    useEffect(() => {
        getAllData();
    }, [page, search, direction, size]);
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        startLoading();
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
                stopLoading(true, "Đã đăng nhập");
            }
            stopLoading(true, "Chưa đăng nhập");
        })
    }, []);
    const getAllData = () => {
        getAllProjectByAdmin(page, size, "id", direction, searchField, search).then(res => {
            if (res.status === 200) {
                setPageResponse(res);
                setProjects(res.data.items);
                const projectIds = res.data.items.map((project: ProjectDTO) => project.id);
                getMembersByProjectIds(projectIds).then(res => {
                    if (res.status === 200) {
                        setMembers(res.data);
                    }
                });
                getDocumentsByProjectIds(projectIds).then(res => {
                    if (res.status === 200) {
                        setDocuments(res.data);
                    }
                });
            }
        })
    }
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
    return (
        <div>
            {isLogin &&
                <div>
                    <div className="wrapper">
                        <input type="checkbox" id="btn" hidden />
                        <label htmlFor="btn" className="menu-btn">
                            <i className="fas fa-bars"></i>
                            <i className="fas fa-times"></i>
                        </label>
                        <nav id="sidebar" style={{ background: 'black' }}>
                            <ul className="list-items">
                                <li><Link to={"/admin"}><i className="fas fa-home"></i>Trang chủ</Link></li>
                                <li><Link to={"/admin"}><i className="fa-solid fa-list"></i>Danh mục</Link></li>
                                <li><Link to={"/admin"}><i className="fa-regular fa-user"></i>Người dùng</Link></li>
                                <li><a href="#"><i className="fas fa-cog"></i>Settings</a></li>
                                <li><a href="#"><i className="fas fa-stream"></i>Features</a></li>
                                <li><a href="#"><i className="fas fa-user"></i>About us</a></li>
                                <li><a href="#"><i className="fas fa-globe-asia"></i>Languages</a></li>
                                <li><a href="#"><i className="fas fa-envelope"></i>Contact us</a></li>
                                <div className="icons">
                                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#"><i className="fab fa-twitter"></i></a>
                                    <a href="#"><i className="fab fa-github"></i></a>
                                    <a href="#"><i className="fab fa-youtube"></i></a>
                                </div>
                            </ul>
                        </nav>
                    </div>
                    <div className="content container">
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
                                    </ul>
                                    <form className="d-flex">
                                        <input ref={searchRef} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                        <button onClick={handleSearch} className="btn btn-outline-success" type="submit">Search</button>
                                    </form>
                                </div>
                            </div>
                        </nav>
                        <TableProject pageResponse={pageResponse} setPage={setPage} page={page} projects={projects} members={members} documents={documents} />
                    </div>
                </div>
            }
        </div>
    );
}