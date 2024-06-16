import { useEffect, useState } from 'react';
import '../css/stylelogin.css';
import '../css/mainlogin.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/vnua.png';
import { login } from '../../api/AuthenticationApi';
export const Login = ({ startLoading, stopLoading }: { startLoading: () => void, stopLoading: (success?: boolean, message?: string) => void }) => {
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
                focusFirstInputField();
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Đăng nhập thất bại !.');
        }
    };
    const focusFirstInputField = () => {
        const input = document.querySelector('input');
        if (input) {
            input.focus();
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
                        <div className="login__field">
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
                        <div className="login__field">
                            <i className="login__icon fas fa-lock"></i>
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setError('')
                                }}
                                type="password"
                                className="login__input"
                                placeholder="Mật Khẩu "
                            />
                        </div>
                        <div>
                            <span className='text-danger'>{error}</span>
                        </div>
                        <button
                            className="button login__submit"
                            type="button"
                            onClick={handleLogin}
                        >
                            <span className="button__text">Đăng nhập</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>
                    <div className="create_account">
                        <Link to="/register">Tạo tài khoản mới</Link>
                    </div>
                    <div className="create_account">
                        <Link to="/forgot-password">Bạn quên mật khẩu?</Link>
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
