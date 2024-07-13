import React, { useEffect, useState } from 'react';
import '../css/Admin.css';
import { TableProject } from './TableProject';
import { verifyAdmin, verifyToken } from '../../api/CommonApi';
import { CategoryAdmin } from './Category';
import { TableUser } from './TableUser';
import { toast, ToastContainer } from 'react-toastify';

export const Admin: React.FC = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [selected, setSelected] = useState('home');
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
            } else {
                toast.error("Bạn chưa đăng nhập", { containerId: 'admin' })
            }
        })
        verifyAdmin().then(res => {
            if (res.status === 200) {
                setIsAdmin(true);
            }
        })

    }, []);
    return (
        <div>
            <ToastContainer containerId='admin' />
            {isLogin && isAdmin &&
                <div>
                    <div className="wrapper">
                        <input type="checkbox" id="btn" hidden />
                        <label htmlFor="btn" className="menu-btn">
                            <i className="fas fa-bars"></i>
                            <i className="fas fa-times"></i>
                        </label>
                        <nav id="sidebar" style={{ background: 'black' }}>
                            <ul className="list-items">
                                <li onClick={() => setSelected("home")} style={{ cursor: 'pointer' }}><a><i className="fas fa-home"></i>Trang chủ</a></li>
                                <li onClick={() => setSelected("users")} style={{ cursor: 'pointer' }}><a ><i className="fa-regular fa-user"></i>Người dùng</a></li>
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
                    {selected === 'home' &&
                        <div>
                            <TableProject />
                            <CategoryAdmin />
                        </div>
                    }
                    {
                        selected === 'users' &&
                        <TableUser />
                    }
                </div>
            }
        </div>
    );
}