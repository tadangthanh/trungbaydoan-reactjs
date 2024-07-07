import { Link } from "react-router-dom";
import logo from '../../assets/img/vnua.png';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { register, verifyEmail } from "../../api/AuthenticationApi";
interface Props {
    startLoading: () => void;
    stopLoading: (success?: boolean, message?: string) => void;
}
export const PageRegister: React.FC<Props> = ({ startLoading, stopLoading }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
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
            setShowCodeInput(true);
            stopLoading(false);

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
            alert('Đăng ký thành công');
            navigate('/login2');
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
        <div className="container">
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
                                    <span className='text-danger text-center mb-2'>{error}</span>
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