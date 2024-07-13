import { Link } from "react-router-dom";
import { deleteToken, getEmailFromToken, getIdFromToken, verifyToken } from "../../api/CommonApi";
import { useEffect, useState } from "react";
import '../css/Header.css';
import 'react-toastify/dist/ReactToastify.css';
import { Notification } from "./Notification";
import logo from '../../assets/img/vnua.png';
import { getUserByEmail } from "../../api/user/UserAPI";
import { User } from "../../model/User";
import { toast, ToastContainer } from "react-toastify";
import { ProjectDTO } from "../../model/ProjectDTO";
import { getAllProjectPending } from "../../api/projectAPI/ProjectAPI";
import { PageResponse } from "../../model/PageResponse";
export const Header = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [projectsPending, setProjectsPending] = useState<ProjectDTO[]>([] as ProjectDTO[]);
    const [page, setPage] = useState(1);
    const [pageResponse, setPageResponse] = useState({} as PageResponse);
    const [email, setEmail] = useState(getEmailFromToken() || '');
    const [hasNext, setHasNext] = useState(false);
    const [role, setRole] = useState('');
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
                getUserByEmail(email).then(res => {
                    if (res.status === 200) {
                        setUser(res.data);
                        setRole(res.data.role);
                    }
                });
            }
        });

    }, []);
    useEffect(() => {
        handleGetProjectPending();
    }, [page]);
    const handleGetProjectPending = () => {
        if (isLogin && email !== '') {
            getAllProjectPending(email, page, 5).then(res => {
                if (res.status === 200) {
                    setHasNext(res.data.hasNext);
                    setProjectsPending(res.data.items);
                }
            })
        }
    }
    const convertHtmlToText = (html: string) => {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    const handleUserClick = (e: any) => {
        e.preventDefault();
        setShowUserMenu(!showUserMenu);
    };
    const handleOutsideClick = (e: any) => {
        if (!e.target.closest('.notification-menu') && !e.target.closest('.user-menu')) {
            setShowUserMenu(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);
    const handleLogout = () => {
        deleteToken();
        window.location.href = '/login';
    };
    const [user, setUser] = useState<User>({} as User);
    useEffect(() => {
        const email = getEmailFromToken() || '';
        if (email) {
            getUserByEmail(getEmailFromToken()).then(res => {
                if (res.status === 200) {
                    setUser(res.data);
                } else {
                    toast.error(res.message, { containerId: 'header' });
                }
            });
        }

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };

    }, []);
    return (
        <div style={{ position: 'sticky', top: '0', zIndex: '2000' }}>
            <ToastContainer containerId={`header`} />
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to={`/`}>Home</Link>
                    <Link style={{ float: 'right' }} className="nav-link text-white" to={`/add-project`}>Thêm đồ án</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item me-2 ">
                                {isLogin && <Notification userId={getIdFromToken()} />}
                            </li>
                            <li className="nav-item item-menu-user">
                                <div className="user-menu">
                                    <a className="nav-link" href="#" onClick={handleUserClick}>
                                        <img style={{ width: '23px', height: '23px' }} className="img-profile small rounded-circle" src={user?.avatarUrl && isLogin ? user.avatarUrl : logo} alt="Profile" />
                                    </a>
                                    <div className={`dropdown-menu ${showUserMenu ? 'show' : ''}`}>
                                        {isLogin ? (
                                            <>
                                                <Link className="dropdown-item" to={`/profile/${getEmailFromToken()}`}><i className=" me-2 fa-regular fa-user"></i>Profile</Link>
                                                {role === "ROLE_STUDENT" && <button onClick={handleGetProjectPending} type="button" className="dropdown-item" data-toggle="modal" data-target="#exampleModalCenter" ><i className="me-2 fa-solid fa-hourglass-half"></i>Đồ án chờ duyệt</button>}
                                                <Link className="dropdown-item" to={"/admin"}><i className="me-2 fa-solid fa-gauge-high"></i>Admin</Link>
                                                <a className="dropdown-item" onClick={handleLogout}> <i className=" me-2 fa-solid fa-right-from-bracket"></i>Logout</a>
                                            </>
                                        ) : (<Link className="dropdown-item" to="/login">Login</Link>)}


                                    </div>

                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
                {isLogin &&
                    <div className="modal fade" id="exampleModalCenter" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Đang chờ duyệt</h5>
                                    <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Tên đồ án </th>
                                                <th scope="col">Tóm tắt</th>
                                                <th scope="col">Ngày nộp</th>
                                                <th scope="col">Loại</th>
                                                <th scope="col">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                projectsPending.map((project, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th scope="row">{project.id}</th>
                                                            <td>{convertHtmlToText(project.name)}</td>
                                                            <td>{convertHtmlToText(project.summary)}</td>
                                                            <td>{project.submissionDate}</td>
                                                            <td>{project.categoryName}</td>
                                                            <td>{project.projectStatus}</td>
                                                        </tr>
                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>
                                    {hasNext && <span className="text-primary" onClick={() => setPage(page + 1)} style={{ cursor: 'pointer' }}>Xem thêm</span>}
                                    {!hasNext && <span className="text-warning">Hết dữ liệu</span>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                }
            </nav>
        </div>
    );
};
