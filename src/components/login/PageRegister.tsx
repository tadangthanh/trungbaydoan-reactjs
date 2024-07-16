import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { register, verifyEmail } from "../../api/AuthenticationApi";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../common/LoadingSpinner";
import { getCodeVerify, resendCode } from "../../api/user/UserAPI";
import { getEmailFromToken } from "../../api/CommonApi";

export const PageRegister: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const handleRegister = async (e: any) => {
        if (!email || !password || !passwordConfirm) {
            setError('Vui lòng nhập đủ thông tin');
            toast.error('Vui lòng nhập đủ thông tin', { containerId: 'page-register' });
            return;
        }
        setLoading(true);
        e.preventDefault();
        try {
            if (password !== passwordConfirm) {
                setError('Mật khẩu không khớp');
                toast.error('Mật khẩu không khớp', { containerId: 'page-register' });
                setLoading(false);
                return;
            }
            const request = { email, password, passwordConfirm };
            const response = await register(request);
            if (response.status !== 201) {
                setError(response.message);
                toast.error(response.message, { containerId: 'page-register' });
                focusFirstInputField();
                setLoading(false);
                return;
            }
            setIsCode(true);
            toast.success(response.message, { containerId: 'page-register' });
            setShowCodeInput(true);
        } catch (error) {
            setError('Đăng kí thất bại');
            toast.error('Đăng kí thất bại', { containerId: 'page-register' });
        }
        setLoading(false);
    };
    const focusFirstInputField = () => {
        const input = document.querySelector('input');
        if (input) {
            input.focus();
        }
    }
    const handleVerify = async (e: any) => {
        if (!code) {
            setError('Vui lòng nhập mã xác nhận');
            toast.error('Vui lòng nhập mã xác nhận', { containerId: 'page-register' });
            return
        }
        setLoading(true);
        e.preventDefault();
        try {
            const response = await verifyEmail(code);
            if (response.status !== 200) {
                setError(response.message);
                toast.error(response.message, { containerId: 'page-register' });
                focusFirstInputField();
                setLoading(false);
                return;
            }
            navigate('/login', { state: { message: 'Đăng ký thành công' } });
        } catch (error) {
            setError('Xác nhận thất bại');
        }
        setLoading(false);
    }
    useEffect(() => {
        focusFirstInputField();
    }, [])
    const handleSendCode = () => {
        setLoading(true);
        resendCode(email).then(res => {
            if (res.status === 200) {
                toast.success(res.message, { containerId: 'page-register' });
                setIsCode(true);
                setLoading(false);
            }
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <div className="container">
            <Loading loading={loading} />
            <ToastContainer containerId='page-register' />
            <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                        <div className="col-lg-7">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                                </div>
                                <form className="user">

                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-user"
                                            placeholder="Email sinh viên/giáo viên" value={email} onChange={(e) => {
                                                setEmail(e.target.value)
                                                setError('')
                                            }} />
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="password" className="form-control form-control-user"
                                                id="exampleInputPassword" placeholder="Password" value={password} onChange={(e) => {
                                                    setPassword(e.target.value)
                                                    setError('')
                                                }} />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control form-control-user"
                                                placeholder="Repeat Password" value={passwordConfirm} onChange={(e) => {
                                                    setPasswordConfirm(e.target.value)
                                                    setError('')
                                                }} />
                                        </div>
                                        {showCodeInput && <div className="form-group mt-3">
                                            <input type="number" className="form-control form-control-user"
                                                placeholder="Mã xác nhận" value={code}
                                                onChange={(e) => {
                                                    setCode(e.target.value)
                                                    setError('')
                                                }} />
                                        </div>}
                                    </div>
                                    {isCode && <div className="input-container">
                                        <span>Bạn không nhận được mã ? </span>
                                        <span onClick={handleSendCode} style={{ cursor: 'pointer' }} className="link-primary">Gửi lại </span>
                                    </div>}
                                    <div className='text-danger text-center mb-2'>{error}</div>
                                    {
                                        !showCodeInput && <a href="#" onClick={handleRegister} className="btn btn-primary btn-user btn-block">
                                            Đăng ký
                                        </a>
                                    }
                                    {showCodeInput && <a href="#" onClick={handleVerify} className="btn btn-primary btn-user btn-block">
                                        Đăng ký
                                    </a>}

                                </form>
                                <hr />
                                <div className="text-center">
                                    <Link className='small' to="/forgot-password">Quên mật khẩu?</Link>
                                </div>
                                <div className="text-center">

                                    <Link className="small" to="/login">Quay lại trang đăng nhập</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
