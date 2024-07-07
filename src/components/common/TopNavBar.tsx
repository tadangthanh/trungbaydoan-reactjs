import { Link } from "react-router-dom";
import { deleteToken, getEmailFromToken, getIdFromToken, verifyToken } from "../../api/CommonApi";
import { useEffect, useState } from "react";
import '../css/Header.css';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/img/vnua.png';
import { Notifications } from "./Notifications";
import { User } from "../../model/User";
import { getUserByEmail } from "../../api/user/UserAPI";

export const TopNavBar: React.FC = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [user, setUser] = useState<User>({} as User);

    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
                return;
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
    const handleLogout = () => {
        deleteToken();
        window.location.href = '/login';
    }
    return (
        <nav style={{ position: 'sticky', top: '0', zIndex: '2000', boxShadow: '0 4px 1px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' }} className="navbar navbar-expand navbar-light bg-white topbar static-top">

            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>

            <form
                className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                        aria-label="Search" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>

            <ul className="navbar-nav ml-auto">

                <li className="nav-item dropdown no-arrow d-sm-none">
                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-search fa-fw"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                        aria-labelledby="searchDropdown">
                        <form className="form-inline mr-auto w-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                    placeholder="Search for..." aria-label="Search"
                                    aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    {/* Thoong bao */}
                    {isLogin && <Notifications userId={getIdFromToken()} />}
                </li>

                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-envelope fa-fw"></i>
                        <span className="badge badge-danger badge-counter">7</span>
                    </a>
                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="messagesDropdown">
                        <h6 className="dropdown-header">
                            Message Center
                        </h6>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="dropdown-list-image mr-3">
                                <img className="rounded-circle" src="img/undraw_profile_1.svg" alt="..." />
                                <div className="status-indicator bg-success"></div>
                            </div>
                            <div className="font-weight-bold">
                                <div className="text-truncate">Hi there! I am wondering if you can help me with a
                                    problem I've been having.</div>
                                <div className="small text-gray-500">Emily Fowler · 58m</div>
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="dropdown-list-image mr-3">
                                <img className="rounded-circle" src="img/undraw_profile_2.svg" alt="..." />
                                <div className="status-indicator"></div>
                            </div>
                            <div>
                                <div className="text-truncate">I have the photos that you ordered last month, how
                                    would you like them sent to you?</div>
                                <div className="small text-gray-500">Jae Chun · 1d</div>
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="dropdown-list-image mr-3">
                                <img className="rounded-circle" src="img/undraw_profile_3.svg" alt="..." />
                                <div className="status-indicator bg-warning"></div>
                            </div>
                            <div>
                                <div className="text-truncate">Last month's report looks great, I am very happy with
                                    the progress so far, keep up the good work!</div>
                                <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                            </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                            <div className="dropdown-list-image mr-3">
                                <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                    alt="..." />
                                <div className="status-indicator bg-success"></div>
                            </div>
                            <div>
                                <div className="text-truncate">Am I a good boy? The reason I ask is because someone
                                    told me that people say this to all dogs, even if they aren't good...</div>
                                <div className="small text-gray-500">Chicken the Dog · 2w</div>
                            </div>
                        </a>
                        <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                    </div>
                </li>

                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{user?.fullName && isLogin ? user.fullName : "Chức năng"}</span>
                        <img className="img-profile rounded-circle" src={user?.avatarUrl && isLogin ? user.avatarUrl : logo} alt="Profile" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown">
                        {isLogin && <Link className="dropdown-item" to={`/profile/${getEmailFromToken()}`}> <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Profile</Link>}
                        <div className="dropdown-divider"></div>
                        {isLogin ? <a onClick={handleLogout} className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout</a> :
                            <Link className="dropdown-item" data-toggle="modal" data-target="#loginModal" to={"/login"}>Login</Link>
                        }
                    </div>
                </li>

            </ul>

        </nav>
    )
}