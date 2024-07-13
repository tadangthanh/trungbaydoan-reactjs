import React, { useEffect, useRef, useState } from 'react';
import { ProjectDTO } from "../../model/ProjectDTO";
import logo from '../../assets/img/vnua.png';
import { PageResponse } from '../../model/PageResponse';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from '../../model/User';
import { activeUserByIds, getAllUserByAdmin, inactiveUserByIds } from '../../api/user/UserAPI';

export const TableUser: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("")
    const [searchField, setSearchField] = useState("")
    const [direction, setDirection] = useState("DESC")
    const [pageResponse, setPageResponse] = useState({} as PageResponse);
    const [size, setSize] = useState(10);

    useEffect(() => {
        getAllData();
    }, [page, search, direction, size]);
    const getAllData = () => {
        getAllUserByAdmin(page, size, "id", direction, searchField, search).then(res => {
            if (res.status === 200) {
                setPageResponse(res);
                setUsers(res.data.items);
                const projectIds = res.data.items.map((project: ProjectDTO) => project.id);
            } else {
                toast.error(res.message, { containerId: 'table-user-admin' })
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
    const handleFilterActive = (e: any) => {
        setSearch(e.target.value)
        setSearchField("status")
    }
    const handleActive = (userId: number) => {
        activeUserByIds(userId).then(res => {
            if (res.status === 200) {
                setUsers(pre => pre.map(user => user.id === userId ? { ...user, status: true } : user))
                toast.success(res.message, { containerId: 'table-user-admin' })
            } else {
                toast.error(res.message, { containerId: 'table-user-admin' })
            }
        });
    }
    const handleInActive = (userId: number) => {
        inactiveUserByIds(userId).then(res => {
            if (res.status === 200) {
                setUsers(pre => pre.map(user => user.id === userId ? { ...user, status: false } : user))
                toast.success(res.message, { containerId: 'table-user-admin' })
            } else {
                toast.error(res.message, { containerId: 'table-user-admin' })
            }
        });
    }

    return (
        <div className="content container">
            <ToastContainer containerId='table-user-admin' />
            <nav className="navbar navbar-expand-lg navbar-light ">
                <div className="container-fluid">
                    <span className="navbar-brand">Danh sách User</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarScroll">
                        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" >
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
                                    <i className="ms-2 me-1 fa-solid fa-sort"></i>Trạng thái
                                </label>
                                <select name="" onChange={handleFilterActive}>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
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
                                                        <th scope="col">TÊN</th>
                                                        <th scope="col">EMAIL</th>
                                                        <th scope="col">KHOA</th>
                                                        <th scope="col">CHUYÊN NGÀNH</th>
                                                        <th scope="col">KHÓA</th>
                                                        <th scope="col">TRẠNG THÁI</th>
                                                        <th scope="col"><i className="me-1 fa-solid fa-gear"></i>CHỨC NĂNG</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user, index) => (
                                                        <tr key={index}>
                                                            <td>{user.id}</td>
                                                            <td>{user.fullName}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.major}</td>
                                                            <td>{user.department}</td>
                                                            <td>{user.academicYear}</td>
                                                            <td className={user.status ? "text-success" : "text-secondary"}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="me-2  fa-solid fa-circle"></i>{user.status ? "ACTIVE" : "INACTIVE"}
                                                                </div>
                                                            </td>
                                                            <td><div className="dropdown">
                                                                <span role='button' className="no-select item-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    {user.status ? "ACTIVE" : "INACTIVE"}
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    <li onClick={() => handleInActive(user.id)}><a href="#" className="nav-link"><i className="me-1 fa-solid fa-ban"></i>INACTIVE</a></li>
                                                                    <li onClick={() => handleActive(user.id)}><a href="#" className="nav-link"><i className="me-1 fa-regular fa-eye"></i>ACTIVE</a></li>
                                                                </ul>
                                                            </div></td>
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
            </>
        </div>

    );
};
