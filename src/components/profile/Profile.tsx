import React, { useEffect, useRef, useState } from 'react';
import '../css/Profile.css'
import { Header } from '../common/Header';
import { useParams } from 'react-router-dom';
import { changePassword, getCodeVerify, getUserByEmail, uploadAvatar } from '../../api/user/UserAPI';
import { User } from '../../model/User';
import logo from '../../assets/img/vnua.png';
import { deleteToken, getEmailFromToken, verifyToken } from '../../api/CommonApi';
import { ProjectElement } from './ProjectElement';
import { ProjectDTO } from '../../model/ProjectDTO';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { getAllProjectByUserEmail, getProjectsByMentorEmail } from '../../api/projectAPI/ProjectAPI';
import { FaArrowUp } from 'react-icons/fa';
export const Profile: React.FC = () => {
    const { email } = useParams() as any;
    const [error, setError] = useState<string>('');
    const [file, setFile] = useState<File>();
    const [user, setUser] = useState<User>({} as User);
    const [editAvatar, setEditAvatar] = useState(false);
    const [projects, setProjects] = useState<ProjectDTO[]>([] as ProjectDTO[]);
    const [isLogin, setIsLogin] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [page, setPage] = useState(1);
    const [role, setRole] = useState('');
    useEffect(() => {
        getUserByEmail(email).then(res => {
            if (res.status !== 200) {
                window.location.href = "/error-not-found";
            }
            setUser(res.data);
            setRole(res.data.role);
            document.title = res.data.fullName;
        });
    }, [email]);
    useEffect(() => {
        if (role === 'ROLE_TEACHER') {
            getProjectsByMentorEmail(email, page, 6).then(res => {
                if (res.status !== 200) {
                    alert("Lỗi tải dữ liệu");
                    return;
                }
                console.log("page", page)
                setHasNext(res.data.hasNext);
                setProjects([...projects, ...res.data.items]);
            });
        } else {
            getAllProjectByUserEmail(email, page, 6).then(res => {
                if (res.status !== 200) {
                    alert("Lỗi tải dữ liệu");
                    return;
                }
                console.log([...projects, ...res.data.items])
                setHasNext(res.data.hasNext);
                setProjects([...projects, ...res.data.items]);
            });
        }
    }, [role, page, email]);
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
            }
        })
    }, [])
    const handleEditAvatar = () => {
        setEditAvatar(!editAvatar);
    }
    const [imageUrl, setImageUrl] = useState('');
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            const documentTypes = [
                "image/jpeg",
                "image/png"
            ];
            if (!documentTypes.includes(selectedFile?.type)) {
                setError("Chỉ chấp nhận file ảnh");
                return;
            }
            const imageUrl = URL.createObjectURL(selectedFile); // Tạo đường dẫn URL cho file
            setImageUrl(imageUrl); // Cập nhật state để hiển thị ảnh
            setFile(selectedFile);
        }
    };
    const handleCancelUpload = () => {
        setFile(undefined);
        setError('');
        setEditAvatar(false);
    }
    const handleUpload = () => {
        uploadAvatar(file as File).then(res => {
            if (res.status !== 200) {
                alert("Upload ảnh đại diện thất bại");
                handleCancelUpload();
                return;
            }
            setUser({ ...user, avatarUrl: res.data.avatarUrl });
            handleCancelUpload();
        });
    }
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState({ url: '' });
    const handleMediaClick = (url: string) => {
        setSelectedMedia({ url });
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const imgRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
        imgRef.current?.addEventListener('click', () => handleMediaClick(imgRef.current?.src as string));
        return () => {
            imgRef.current?.removeEventListener('click', () => handleMediaClick(imgRef.current?.src as string));
        };
    }, []);
    const refTop = useRef<HTMLDivElement>(null);
    useEffect(() => {
        refTop.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    const [currentPasswordHidden, setCurrentPasswordHidden] = useState(false);
    const [newPasswordHidden, setNewPasswordHidden] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordError('');
        setCode('');
        setIsCode(false);
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsCode(false);
        setPasswordError('');
        setCode('');
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsCode(false);
        setPasswordError('');
        setCode('');
        setConfirmPassword(e.target.value);
    };
    const [isCode, setIsCode] = useState(false);
    const [labelCode, setLabelCode] = useState('Code ?');
    const [code, setCode] = useState('');
    const handleSendCode = () => {
        getCodeVerify(getEmailFromToken()).then(res => {
            if (res.status === 200) {
                setTimeLeft(60);
                setIsCode(true);
                setLabelCode("nhập mã của bạn");
            } else {
                setPasswordError(res.message);
                setIsCode(false);
                setConfirmPassword('');
                setNewPassword('');
                setCurrentPassword('');
                setLabelCode('Code ?');
            }
        })
    }
    const handleChangePassword = () => {
        const updateNewPassword = {
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
            code: code
        }
        changePassword(user.id, updateNewPassword).then(res => {
            if (res.status === 204) {
                deleteToken();
                alert("Đổi mật khẩu thành công");
                window.location.href = '/login';
            } else {
                setCode('');
                setIsCode(false);
                setConfirmPassword('');
                setNewPassword('');
                setCurrentPassword('');
                setPasswordError(res.message);
            }
        })
    }
    const handleShowMore = () => {
        setPage(page + 1);
    }
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        // exit early when we reach 0
        if (!timeLeft) return;

        if (timeLeft === 0) {
            setIsCode(true);
            setTimeLeft(0);
        }
        const intervalId = setInterval(() => {

            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    return (
        <div>
            <div ref={refTop}></div>
            <Header />
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img ref={imgRef} style={{ cursor: 'pointer' }} className="rounded-circle mt-5" width="150px" src={imageUrl ? imageUrl : user.avatarUrl === "" || user.avatarId === undefined ? logo : user.avatarUrl} alt="Profile" />
                            <span className="font-weight-bold">{user.fullName}</span>
                            <span className="text-black-50">{user.email?.split("@")[0]}</span>
                            {editAvatar && <input onChange={handleFileChange} type="file" className="form-control" />}
                            {!editAvatar && isLogin && getEmailFromToken() === email && <span className="btn" onClick={handleEditAvatar} title='thay đổi ảnh đại diện'><i className="fa-regular fa-pen-to-square"></i></span>}
                            <span className='mt-2'>{file && !error && <button onClick={handleUpload} className='btn btn-secondary'>upload</button>}{editAvatar && <button onClick={handleCancelUpload} className='btn btn-danger'>cancel</button>}</span>
                            <span className='text-danger'>{error}</span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile</h4>
                            </div>
                            <form>
                                <div className="row mt-2">
                                    <div className="col-md-12">
                                        <label className="label">Name</label>
                                        <input title='Không được chỉnh sửa' type="text" readOnly className="form-control" value={user.fullName} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-12">
                                        <label className="label">Email</label>
                                        <input title='Không được chỉnh sửa' type="text" readOnly className="form-control" value={user.email} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="label">Lớp</label>
                                        <input title='Không được chỉnh sửa' type="text" readOnly className="form-control" value={user.className} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="label">Chuyên ngành</label>
                                        <input title='Không được chỉnh sửa' type="text" readOnly className="form-control" value={user.department} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="label">Khoa</label>
                                        <input title='Không được chỉnh sửa' type="text" readOnly className="form-control" value={user.major} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="label">Khóa</label>
                                        <input title='Không được chỉnh sửa' type="text" readOnly className="form-control" value={user.academicYear} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {isLogin && getEmailFromToken() === email && <div className="col-md-4">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center experience">
                                <span>Thay đổi mật khẩu</span>
                            </div>
                            <div className="mt-3">
                                <label className="label">Mật khẩu hiện tại</label>
                                <input value={currentPassword} onChange={handleCurrentPasswordChange} type={currentPasswordHidden ? "text" : "password"} className="form-control" placeholder="Nhập mật khẩu hiện tại" />
                                <input style={{ cursor: 'pointer' }} onChange={(e) => { setCurrentPasswordHidden(e.target.checked) }} id='showPasswordCurrent' type="checkbox" /><label style={{ cursor: 'pointer' }} htmlFor='showPasswordCurrent'>Hiển thị mật khẩu</label>
                            </div>
                            <div className="mt-3">
                                <label className="label">Mật khẩu mới</label>
                                <input value={newPassword} onChange={handleNewPasswordChange} type={newPasswordHidden ? "text" : "password"} className="form-control" placeholder="Nhập mật khẩu mới" />
                            </div>
                            <div className="mt-3">
                                <label className="label">Nhập lại mật khẩu mới</label>
                                <input value={confirmPassword} onChange={handleConfirmPasswordChange} type={newPasswordHidden ? "text" : "password"} className="form-control" placeholder="Nhập lại mật khẩu mới" />
                                <input style={{ cursor: 'pointer' }} onChange={(e) => { setNewPasswordHidden(e.target.checked) }} id='showNewPassword' type="checkbox" /><label style={{ cursor: 'pointer' }} htmlFor='showNewPassword'>Hiển thị mật khẩu</label>
                            </div>
                            <span className='text-danger'>{passwordError}</span>
                            <div className="mt-3">
                                <label className="label">Mã xác nhận</label>
                                <div className="input-container">
                                    <input onChange={(e) => setCode(e.target.value)} value={code} type="text" disabled={isCode === false} className="form-control" placeholder={labelCode} />
                                    {!isCode && <button disabled={passwordError === "" && currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0 ? false : true} onClick={handleSendCode} className="inline-button">Lấy mã</button>}
                                    {isCode && <button onClick={handleChangePassword}>Đổi mật khẩu</button>}
                                </div>
                                {isCode && <div className="input-container">
                                    <span>Vui lòng đợi để gửi lại mã ? </span>
                                    <span hidden={timeLeft === 0 ? false : true} onClick={handleSendCode} style={{ cursor: 'pointer' }} className="link-primary">Gửi lại</span> {timeLeft !== 0 && <span className='text-danger'>{timeLeft} giây</span>}
                                </div>}
                            </div>
                        </div>
                    </div>}
                    <div className="projects-container">
                        <div className="tab-content p-4">
                            <div className="tab-pane active show" id="projects-tab" role="tabpanel">
                                <div className="d-flex align-items-center">
                                    <div className="flex-1">
                                        <h4 className="card-title mb-4">{user.role === "ROLE_TEACHER" ? "Projects mentor" : "Projects"}</h4>
                                    </div>
                                </div>
                                <div className="row" id="all-projects">
                                    {projects.map((project, index) => {
                                        return <ProjectElement key={index} project={project} />
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            hasNext && <button onClick={handleShowMore}>Hiển thị thêm</button>
                        }
                    </div>
                </div>
            </div>
            <Dialog style={{ zIndex: '4000' }} open={isOpen} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>Media Preview</DialogTitle>
                <DialogContent>
                    <img
                        src={selectedMedia.url}
                        style={{ width: '100%', height: '100%' }}
                        alt="Preview"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <div
                className="scroll-to-top"
                onClick={scrollToTop}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >

                <FaArrowUp style={{ marginTop: '8px' }} />
            </div>
        </div>
    );
};
