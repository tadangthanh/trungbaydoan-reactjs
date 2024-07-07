import { Link } from "react-router-dom";
import { deleteToken, getEmailFromToken, getIdFromToken, verifyToken } from "../../api/CommonApi";
import { useEffect, useState } from "react";
import '../css/Header.css';
import 'react-toastify/dist/ReactToastify.css';
import { Notification } from "./Notification";
import logo from '../../assets/img/vnua.png';
import { getUserByEmail } from "../../api/user/UserAPI";
import { User } from "../../model/User";
import { Admin } from "../admin/Admin";
export const Header = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
            }
        });
    }, []);
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
        getUserByEmail(getEmailFromToken() || 'a').then(res => {
            if (res.status === 200) {
                setUser(res.data);
            }
        });
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };

    }, []);
    return (
        <div style={{ position: 'sticky', top: '0', zIndex: '2000' }}>
            {/* <ToastContainer /> */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="#!">Start Bootstrap</a>
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
                                                <Link className="dropdown-item" to={"/admin"}><i className="me-2 fa-solid fa-user-tie"></i>Admin</Link>
                                                <a className="dropdown-item" onClick={handleLogout}> <i className=" me-2 fa-solid fa-right-from-bracket"></i>Logout</a>

                                            </>
                                        ) : (<Link className="dropdown-item" to="/login">Login</Link>)}

                                    </div>

                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};
