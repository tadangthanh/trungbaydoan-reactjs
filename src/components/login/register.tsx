import { Link } from "react-router-dom";
import logo from '../../assets/img/vnua.png';
import { useEffect, useState } from "react";
import '../css/mainlogin.css';
import { useNavigate } from 'react-router-dom';
import { register, verifyEmail } from "../../api/AuthenticationApi";
export const Register = ({ startLoading, stopLoading }: { startLoading: () => void, stopLoading: (success?: boolean, message?: string) => void }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const handleRegister = async (e: any) => {
        startLoading();
        e.preventDefault();
        try {
            if (password !== passwordConfirm) {
                stopLoading(false);
                setError('Mật khẩu không khớp');
                return;
            }
            const request = { email, password, passwordConfirm };
            const response = await register(request);
            if (response.status !== 201) {
                setError(response.message);
                focusFirstInputField();
                stopLoading(false);
                return;
            }
            stopLoading(false);
            showCodeInput();
        } catch (error) {
            setError('Đăng kí thất bại');
            stopLoading(false);
        }
    };
    const focusFirstInputField = () => {
        const input = document.querySelector('input');
        if (input) {
            input.focus();
        }
    }
    const showCodeInput = () => {
        const codeInput = document.getElementById('codeInput');
        const btnRegister = document.getElementById('btn-register');
        const btnVerify = document.getElementById('btn-verify');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (codeInput && btnRegister && btnVerify && emailInput && passwordInput && confirmPasswordInput) {
            btnRegister.style.display = 'none';
            btnVerify.style.display = 'block';
            codeInput.style.display = 'block';
            emailInput.style.display = 'none';
            passwordInput.style.display = 'none';
            confirmPasswordInput.style.display = 'none';
        }
    }
    const handleVerify = async (e: any) => {
        startLoading();
        e.preventDefault();
        try {

            const response = await verifyEmail(code);
            if (response.status !== 200) {
                setError(response.message);
                focusFirstInputField();
                stopLoading(false);
                return;
            }
            stopLoading(true, "Đăng ký thành công, quay trở lại đăng nhập trong vài giây");
            alert('Đăng ký thành công, quay trở lại đăng nhập trong vài giây');
            navigate('/login');
        } catch (error) {
            setError('Xác nhận thất bại');
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
        <div className="login-container">
            <div className="login-screen ">
                <div className="screen__content">
                    <div className="img" title="quay lại đăng nhâp">
                        <Link to="/login"><img src={logo} alt="" /></Link>
                    </div>
                    <form className="login">
                        <div className="login__field" id="email">
                            <i className="login__icon fas fa-user"></i>
                            <input
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError('')
                                }}
                                type="email" required className="login__input" placeholder="Email sinh viên" />
                        </div>
                        <div className="login__field" id="confirmPassword">
                            <i className="login__icon fas fa-lock"></i>
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setError('')
                                }}
                                type="password" required className="login__input" placeholder="Mật Khẩu " />
                        </div>
                        <div className="login__field" id="password">
                            <i className="login__icon fas fa-lock"></i>
                            <input
                                value={passwordConfirm}
                                onChange={(e) => {
                                    setPasswordConfirm(e.target.value)
                                    setError('')
                                }}
                                type="password" required className="login__input" placeholder="Nhập Lại Mật khẩu " />
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
                        <button id="btn-register" className="button login__submit" type="button" onClick={handleRegister}>
                            <span className="button__text">Đăng Kí</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <button id="btn-verify" className="button login__submit" type="button" onClick={handleVerify}>
                            <span className="button__text">Xác nhận</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <div className="create_account">
                            <Link to="/login">Quay lại trang đăng nhập</Link>
                        </div>
                    </form>

                </div>

                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    );
};