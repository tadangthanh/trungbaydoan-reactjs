import React, { useEffect, useState } from 'react';
import '../css/Profile.css'
import { Header } from '../common/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUserByEmail, uploadAvatar } from '../../api/user/UserAPI';
import { User } from '../../model/User';
import logo from '../../assets/img/vnua.png';
import { baseAvatarUrl, getEmailFromToken, verifyToken } from '../../api/CommonApi';
import { ProjectElement } from './ProjectElement';
import { ProjectDTO } from '../../model/ProjectDTO';
import { getAllProjectByUserEmail } from '../../api/projectAPI/ProjectAPI';
export const Profile: React.FC = () => {
    const { email } = useParams() as any;
    const [error, setError] = useState<string>('');
    const [file, setFile] = useState<File>();
    const [user, setUser] = useState<User>({} as User);
    const [editAvatar, setEditAvatar] = useState(false);
    const [projects, setProjects] = useState<ProjectDTO[]>([] as ProjectDTO[]);
    const emailFromToken = getEmailFromToken();
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        getUserByEmail(email).then(res => {
            console.log("res", res)
            if (res.status !== 200) {
                window.location.href = "/error-not-found";
            }
            setUser(res.data)
            console.log("User: ", res.data)
        });
    }, [email]);
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
            }
        })
    }, [])
    useEffect(() => {
        getAllProjectByUserEmail(email).then(res => {
            if (res.status !== 200) {
                alert("Lỗi tải dữ liệu");
                return;
            }
            setProjects(res.data.items);
            console.log("Projects: ", res.data);
        });
    }, [email]);
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
        console.log("file", file)
        uploadAvatar(file as File).then(res => {
            if (res.status !== 200) {
                alert("Upload ảnh đại diện thất bại");
                handleCancelUpload();
                return;
            }
            setUser({ ...user, avatarId: res.data.avatarId });
            console.log("Upload ảnh đại diện thành công", res.data);
            handleCancelUpload();
        });
    }

    return (
        <div>
            <Header />
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src={imageUrl ? imageUrl : user.avatarId === 0 || user.avatarId === undefined ? logo : baseAvatarUrl + user.avatarId} alt="Profile" />
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

                                <div className="mt-5 text-center">
                                    <button className="btn btn-primary profile-button" type="button">Save Profile</button>
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
                                <label className="label">Mật khẩu cũ</label>
                                <input type="text" className="form-control" placeholder="Experience" value="" />
                            </div>
                            <div className="mt-3">
                                <label className="label">Mật khẩu mới</label>
                                <input type="text" className="form-control" placeholder="Additional details" value="" />
                            </div>
                            <div className="mt-3">
                                <label className="label">Nhập lại mật khẩu mới</label>
                                <input type="text" className="form-control" placeholder="Additional details" value="" />
                            </div>
                            <div className="mt-3">
                                <label className="label">Mã xác nhận</label>
                                <div className="input-container">
                                    <input type="text" className="form-control" placeholder="Nhập mã được gửi về email" />
                                    <button className="inline-button">Lấy mã</button>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className="projects-container">
                        <div className="tab-content p-4">
                            <div className="tab-pane active show" id="projects-tab" role="tabpanel">
                                <div className="d-flex align-items-center">
                                    <div className="flex-1">
                                        <h4 className="card-title mb-4">Projects</h4>
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
                    </div>
                </div>
            </div>
        </div>
    );
};
