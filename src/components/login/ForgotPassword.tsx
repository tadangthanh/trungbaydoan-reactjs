import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/img/vnua.png';
import '../css/mainlogin.css'
import { requestResetPassword, resetPassword } from "../../api/AuthenticationApi";
export const ForgotPassword = ({ startLoading, stopLoading }: { startLoading: () => void, stopLoading: (success?: boolean, message?: string) => void }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [code, setCode] = useState('');

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
            alert('Mật khẩu đã được thay đổi');
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
            showCodeInput();
            stopLoading(true, 'Mã xác nhận đã được gửi đến email của bạn');
        } catch (error) {
            setError('Đã xảy ra lỗi');
            stopLoading(false);
        }
    }
    const showCodeInput = () => {
        const codeInput = document.getElementById('codeInput');
        const btnResetPassword = document.getElementById('btn-reset-password');
        const btnHandleResetPassword = document.getElementById('btn-handle-reset-password');
        if (codeInput && btnResetPassword && btnHandleResetPassword) {
            codeInput.style.display = 'block';
            btnResetPassword.style.display = 'none';
            btnHandleResetPassword.style.display = 'block';
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
        <div className="login-container">
            <div className="login-screen">
                <div className="screen__content">
                    <div className="img">
                        <Link to="/login"><img src={logo} alt="" /></Link>
                    </div>
                    <form className="login">
                        <div className="login__field" id='email'>
                            <i className="login__icon fas fa-user"></i>
                            <input
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError('')
                                }}
                                type="text"
                                className="login__input"
                                placeholder="Email sinh viên"
                            />
                        </div>
                        <div className="login__field" id="codeInput">
                            <i className="login__icon fas fa-code"></i>
                            <input
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value)
                                    setError('')
                                }}
                                type="number" required className="login__input" placeholder="Nhập mã xác nhận" />
                        </div>
                        <div>
                            <span className='text-danger'>{error}</span>
                        </div>
                        <button id='btn-reset-password'
                            className="button login__submit"
                            type="button"
                            onClick={createRequest}
                        >
                            <span className="button__text">Gửi mật khẩu mới</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <button id='btn-handle-reset-password'
                            className="button login__submit"
                            type="button"
                            onClick={handleResetPassword}
                        >
                            <span className="button__text">Xác nhận</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>
                    <div className="create_account">
                        <Link to="/login">Quay lại đăng nhập</Link>
                    </div>
                    <div className="create_account">
                        <Link to="/register">Đăng ký tài khoản mới</Link>
                    </div>

                </div>
                <div className="screen__background">
                    <span
                        className="screen__background__shape screen__background__shape4"
                    ></span>
                    <span
                        className="screen__background__shape screen__background__shape3"
                    ></span>
                    <span
                        className="screen__background__shape screen__background__shape2"
                    ></span>
                    <span
                        className="screen__background__shape screen__background__shape1"
                    ></span>
                </div>
            </div>
        </div>
    );
}