import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestResetPassword, resetPassword } from "../../api/AuthenticationApi";
export const PageForgotPassword = ({ startLoading, stopLoading }: { startLoading: () => void, stopLoading: (success?: boolean, message?: string) => void }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const navigate = useNavigate();
    const handleResetPassword = async (e: any) => {
        e.preventDefault();
        startLoading();
        if (code === '') {
            setError('Vui lòng nhập mã xác nhận');
            stopLoading(false);
            return;
        }
        try {
            const response = await resetPassword({ email: email, verifyCode: code });
            if (response.status !== 200) {
                setError(response.message);
                stopLoading(false);
                return;
            }
            stopLoading(true, 'Mã xác nhận đã được gửi đến email của bạn');
            alert('Mật khẩu mới đã được gửi vào email của bạn');
            navigate('/login');
        } catch (error) {
            setError('Đã xảy ra lỗi');
            stopLoading(false);
        }
    };
    const createRequest = async (e: any) => {
        e.preventDefault();
        startLoading();
        if (email === '') {
            setError('Vui lòng nhập email');
            stopLoading(false);
            return;
        }
        try {
            const response = await requestResetPassword(email);
            if (response.status !== 200) {
                setError(response.message);
                stopLoading(false);
                return;
            }
            setShowCodeInput(true);
            stopLoading(true, 'Mã xác nhận đã được gửi đến email của bạn');
        } catch (error) {
            setError('Đã xảy ra lỗi');
            stopLoading(false);
        }
    }
    useEffect(() => {
        const handleKeyPress = (event: any) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const button = document.querySelector('.login__submit') as HTMLButtonElement;
                button.click();
            }
        };
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    return (
        <div className="container">

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