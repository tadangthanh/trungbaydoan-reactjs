import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestResetPassword, resetPassword } from "../../api/AuthenticationApi";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../common/LoadingSpinner";
export const PageForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleResetPassword = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (code === '') {
            setError('Vui lòng nhập mã xác nhận');
            toast.error('Vui lòng nhập mã xác nhận', { containerId: 'page-forgot-password' });
            setLoading(false);
            return;
        }
        try {
            const response = await resetPassword({ email: email, verifyCode: code });
            if (response.status !== 200) {
                setError(response.message);
                toast.error(response.message, { containerId: 'page-forgot-password' });
                setLoading(false);
                return;
            }
            setLoading(false);
            navigate('/login', { state: { message: response.message } });
        } catch (error) {
            setLoading(false);
            toast.error('Đã xảy ra lỗi', { containerId: 'page-forgot-password' });
            setError('Đã xảy ra lỗi');
        }
        setLoading(false);
    };
    const createRequest = async (e: any) => {
        setLoading(true);
        e.preventDefault();
        if (email === '') {
            setError('Vui lòng nhập email');
            toast.error('Vui lòng nhập email', { containerId: 'page-forgot-password' });
            setLoading(false);
            return;
        }
        try {
            const response = await requestResetPassword(email);
            if (response.status !== 200) {
                setError(response.message);
                toast.error(response.message, { containerId: 'page-forgot-password' });
                setLoading(false);
                return;
            }
            setShowCodeInput(true);
            toast.success(response.message, { containerId: 'page-forgot-password' });
            setLoading(false);
        } catch (error) {
            setError('Đã xảy ra lỗi');
            toast.error('Đã xảy ra lỗi', { containerId: 'page-forgot-password' });
            setLoading(false);
        }
        setLoading(false);
    }

    return (
        <div className="container">
            <Loading loading={loading} />
            <ToastContainer containerId='page-forgot-password' />
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
                                            <p className="mb-4">Mật khẩu mới sẽ được gửi vào email của bạn!</p>
                                        </div>
                                        <form className="user">
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-user"
                                                    id="exampleInputEmail" aria-describedby="emailHelp"
                                                    placeholder="Email của bạn" value={email} onChange={e => {
                                                        setEmail(e.target.value)
                                                        setError('')
                                                    }} />
                                            </div>
                                            {showCodeInput && <div className="form-group">
                                                <input type="text" className="form-control form-control-user"
                                                    placeholder="Nhập mã xác nhận được gửi vào email" value={code} onChange={e => {
                                                        setCode(e.target.value)
                                                        setError('')
                                                    }} />
                                            </div>}
                                            <div className="mb-2 d-flex">
                                                <span className='text-danger'>{error}</span>
                                            </div>
                                            {!showCodeInput && <a href="#" onClick={createRequest} className="btn btn-primary btn-user btn-block">
                                                Lấy mã xác nhận
                                            </a>}
                                            {showCodeInput && <a href="#" onClick={handleResetPassword} className="btn btn-primary btn-user btn-block">
                                                Reset Password
                                            </a>}
                                        </form>
                                        <hr />
                                        <div className="text-center">
                                            <Link className='small' to="/register">Tạo tài khoản mới</Link>
                                        </div>
                                        <div className="text-center">
                                            <Link className='small' to="/login">Quay lại trang đăng nhập</Link>
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