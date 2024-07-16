import { useEffect, useState } from 'react';
import '../css/addproject.css';
import { Category } from '../../model/Category';
import { findAllStudentByEmail, findAllTeacherByEmail } from '../../api/user/UserAPI';
import { ProjectCreate } from '../../model/ProjectCreate';
import MyEditor from '../../ckeditor/MyEditor';
import DateInput from '../date/DateInput';
import InputSuggestion from '../input/InputSuggestion';
import { UploadVideo } from './UploadVideo';
import { UploadDocument } from './UploadDocument';
import { verifyToken } from '../../api/CommonApi';
import { Link, useNavigate } from 'react-router-dom';
import { deleteDocument, deleteDocumentAnonymous } from '../../api/documentAPI/DocumentAPI';
import { getAllCategory } from '../../api/categoryAPI/CategoryAPI';
import { createProject } from '../../api/projectAPI/ProjectAPI';
import { toast, ToastContainer } from 'react-toastify';
import { Loading } from '../common/LoadingSpinner';
import { FaArrowUp } from 'react-icons/fa';

export const AddProject = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [documentIds, setDocumentIds] = useState<number[]>([]);
    const [error, setError] = useState('');
    const [containError, setContainError] = useState(true);
    const [memberIds, setMemberIds] = useState<number[]>([]);
    const [projectName, setProjectName] = useState('');
    const [projectSummary, setProjectSummary] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [submissionDate, setSubmissionDate] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const [mentorIds, setMentorIds] = useState<number[]>([]);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [projectCreate, setProjectCreate] = useState<ProjectCreate>({} as ProjectCreate);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
        verifyToken().then((response: any) => {
            if (response.status !== 200) {
                navigate('/login', { state: { message: 'Vui lòng đăng nhập' } });
            }
            setIsLoading(false);
        })
        setLoading(false);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    useEffect(() => {
        getAllCategory()
            .then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    setCategories(data);
                    document.title = "Thêm đồ án";
                } else if (response.status !== 204) {
                    toast.error('Lỗi không xác định', { containerId: 'add-project' });
                }
            }
            );
        setLoading(false);
    }, []);
    const handleEditorChangeProjectSummary = (newContent: string) => {
        setProjectSummary(newContent);
    };
    const handleSetWaiting = (value: boolean) => {
        setWaiting(value);
    }
    const handleEditorChangeDescription = (newContent: string) => {
        setDescription(newContent);
    }
    const handleEditorChangeProjectName = (newContent: string) => {
        setProjectName(newContent);
    };
    const handleSetDocumentIds = (id: number) => {
        setDocumentIds(pre => [...pre, id]);
    }

    const handleAddProject = (e: any) => {
        if (!projectName || !projectSummary || !description || !startDate || !endDate || !submissionDate || !categoryId || mentorIds.length === 0) {
            e.preventDefault();
            setError('Vui lòng nhập đầy đủ thông tin');
            toast.error('Vui lòng nhập đầy đủ thông tin', { containerId: 'add-project' });
            return;
        }
        setLoading(true);
        e.preventDefault();
        const project = {
            name: projectName,
            summary: projectSummary,
            description: description,
            startDate: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)),
            endDate: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
            submissionDate: new Date(new Date(submissionDate).setDate(new Date(submissionDate).getDate() + 1)),
            categoryId: categoryId,
            mentorIds: mentorIds,
            memberIds: memberIds,
            documentIds: documentIds
        }
        createProject(project).then((response: any) => {
            if (response.status !== 201) {
                toast.error(response.message, { containerId: 'add-project' });
                return;
            }
            toast.success(response.message, { containerId: 'add-project' });
            setProjectName('');
            setProjectSummary('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setSubmissionDate('');
            setCategoryId(0);
            setMentorIds([]);
            setMemberIds([]);
            setDocumentIds([]);
            window.location.href = '/';
        }).catch((error: any) => {
            toast.error('Thêm đồ án thất bại', { containerId: 'add-project' });
        }).finally(() => {
            setLoading(false);
        });
        const idsDelete = getIdsDocumentDeleted();
        deleteDocumentAnonymous({ ids: idsDelete }).then((response: any) => {
            if (response.status !== 200) {
                return;
            }
        })
    }

    const [mapIdUrl, setMapIdUrl] = useState(new Map<string, number>());
    const getIdsDocumentDeleted = () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');
        const images = doc.getElementsByTagName('img');
        Array.from(images).forEach((image: any) => {
            const src = image?.src;
            if (mapIdUrl.has(src)) {
                mapIdUrl.delete(src);
            }
        });
        return Array.from(mapIdUrl.values());
    }
    const handleDeleteDocumentIds = (id: number) => {
        setDocumentIds(documentIds.filter(documentId => documentId !== id));
    }
    return (
        <div>
            <Loading loading={loading} />
            <ToastContainer containerId='add-project' />
            {!isLoading && <div className="container mt-5 box-add-project">
                <Link className='back-button' to="/"> <i className="fas fa-arrow-left"></i>
                    Quay lại trang chủ</Link>

                <h2 id='title'>Thêm đồ án</h2>
                <form id="projectForm">
                    <div className="form-group">
                        <label>
                            Tên đồ án <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div id='editor'></div>
                        <MyEditor
                            setContainError={setContainError}
                            maxContentLength={100}
                            handleSetDocumentIds={handleSetDocumentIds}
                            data={projectName}
                            onChange={handleEditorChangeProjectName}
                            uploadImage={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Bản tóm tắt <span style={{ color: 'red' }}>*</span>
                        </label>
                        <MyEditor
                            setContainError={setContainError}
                            maxContentLength={200}
                            handleSetDocumentIds={handleSetDocumentIds}
                            data={projectSummary}
                            onChange={handleEditorChangeProjectSummary}
                            uploadImage={false}
                        />
                    </div>
                    <div id='content' className="form-group">
                        <label>
                            Nội dung (mô tả) <span style={{ color: 'red' }}>*</span>
                        </label>
                        <MyEditor
                            mapIdUrl={mapIdUrl}
                            setMapIdUrl={setMapIdUrl}
                            handleSetDocumentIds={handleSetDocumentIds}
                            data={description}
                            onChange={handleEditorChangeDescription}
                            uploadImage={true}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <DateInput
                                label="Ngày bắt đầu"
                                value={startDate}
                                onChange={(date: string) => setStartDate(date)}
                            />
                        </div>
                        <div className="col-md-4">
                            <DateInput
                                label="Ngày kết thúc"
                                value={endDate}
                                onChange={(date: string) => setEndDate(date)}
                            />
                        </div>
                        <div className="col-md-4">
                            <DateInput
                                label="Ngày nộp"
                                value={submissionDate}
                                onChange={(date: string) => setSubmissionDate(date)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            Thể loại <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select value={categoryId} onChange={(e: any) => setCategoryId(e.target.value)
                        } className="form-control" id="categorySelect"  >
                            <option value="">Chọn thể loại</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.id}>{category.name}</option>
                            ))}
                        </select>

                    </div>
                    <div className='form-group'>
                        <InputSuggestion
                            required={true}
                            label='Giáo viên hướng dẫn'
                            data={mentorIds}
                            setData={setMentorIds}
                            request={findAllTeacherByEmail}
                            idPrefix='mentor'
                            placeholder='Nhập email người hướng dẫn'
                        />
                    </div>
                    <div className='form-group'>
                        <InputSuggestion
                            required={false}
                            label='Thành viên thực hiện'
                            data={memberIds}
                            setData={setMemberIds}
                            request={findAllStudentByEmail}
                            idPrefix='member'
                            placeholder='Nhập email thành viên'
                        />


                    </div>
                    <div className='row'>
                        <div className='form-group col-md-6 col-12'>
                            <UploadVideo
                                handleDeleteDocumentIds={handleDeleteDocumentIds}
                                handleSetWaiting={handleSetWaiting}
                                label='Upload video'
                                handleSetDocumentIds={handleSetDocumentIds}
                                waiting={waiting}
                                documentIds={documentIds}
                                setDocumentIds={setDocumentIds}
                            />
                        </div>
                        <div className='form-group col-md-6 col-12'>
                            <UploadDocument
                                handleDeleteDocumentIds={deleteDocument}
                                handleSetDocumentIds={handleSetDocumentIds}
                                handleSetWaiting={handleSetWaiting}
                                waiting={waiting}
                                label='Upload tài liệu'
                                documentIds={documentIds}
                                setDocumentIds={setDocumentIds}
                            />
                        </div>
                        <span id="add-project-error">{error}</span>
                    </div>

                    <button type="submit" disabled={containError} onClick={handleAddProject} className="btn btn-info btn-add-project">Thêm Đồ Án
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                </form>
            </div>}
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
}
