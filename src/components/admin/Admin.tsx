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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
            } else {
                toast.error("Bạn chưa đăng nhập", { containerId: 'admin' })
                setLoading(false);
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
                                <li onClick={() => setSelected("home")} style={{ cursor: 'pointer', background: '#c48787' }}><i className="fas fa-home"></i>Trang chủ</li>
                                <li onClick={() => setSelected("users")} style={{ cursor: 'pointer', background: '#c48787' }}><i className="fa-regular fa-user"></i>Người dùng</li>
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