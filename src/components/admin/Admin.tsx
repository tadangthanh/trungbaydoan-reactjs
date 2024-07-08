import React, { useEffect, useState } from 'react';
import '../css/Admin.css';
import { TableProject } from './TableProject';
import { Link } from 'react-router-dom';
import { verifyToken } from '../../api/CommonApi';
interface AdminProps {
    startLoading: () => void;
    stopLoading: (success: boolean, message: string) => void;
}
export const Admin: React.FC<AdminProps> = ({ startLoading, stopLoading }) => {
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
                    <TableProject />
                </div>
            }
        </div>
    );
}