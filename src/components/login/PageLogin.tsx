import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../api/AuthenticationApi';
import { toast, ToastContainer } from 'react-toastify';

export const PageLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const request = { email, password };
            const response = await login(request);
            if (response.error) {
                setError(response.message);
                toast.error(response.message, { containerId: 'page-login' });
                focusFirstInputField();
            } else {
                toast.success('Đăng nhập thành công', { containerId: 'page-login' });
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Đăng nhập thất bại !.');
            toast.error('Đăng nhập thất bại !.', { containerId: 'page-login' });
        }
    };
    const focusFirstInputField = () => {
        const input = document.querySelector('input');
        if (input) {
            input.focus();
        }
    }


    return (
        <div className="container">
            <ToastContainer containerId='page-login' />
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                        </div>
                                        <form className="user">
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-user"
                                                    id="exampleInputEmail" aria-describedby="emailHelp"
                                                    placeholder="Enter Email Address..." value={email} onChange={(e) => {
                                                        setEmail(e.target.value)
                                                        setError('')
                                                    }} />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control form-control-user"
                                                    id="exampleInputPassword" placeholder="Password" value={password} onChange={(e) => {
                                                        setPassword(e.target.value)
                                                        setError('')
                                                    }} />
                                            </div>
                                            <div>
                                                <span className='text-danger'>{error}</span>
                                            </div>
                                            <div className="form-group">
                                                <div className="custom-control custom-checkbox small">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                </div>
                                            </div>
                                            <button onClick={handleLogin} className="btn btn-primary btn-user btn-block">
                                                Login
                                            </button>

                                        </form>

                                        <div className="text-center">
                                            <Link className='small' to="/forgot-password">Quên mật khẩu?</Link>
                                        </div>
                                        <div className="text-center">
                                            <Link className='small' to="/register">Tạo tài khoản mới</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}
