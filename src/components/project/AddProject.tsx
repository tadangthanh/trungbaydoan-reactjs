import { useEffect, useState } from 'react';
import '../css/addproject.css';
import { createProject, getAllCategory } from '../../api/projectAPI/addproject';
import { Category } from '../../model/Category';
import { findAllStudentByEmail, findAllTeacherByEmail } from '../../api/user/UserAPI';
import { ProjectCreate } from '../../model/ProjectCreate';
import { User } from '../../model/User';
import MyEditor from '../../ckeditor/MyEditor';
import DateInput from '../date/DateInput';
import InputSuggestion from '../input/InputSuggestion';
import { UploadVideo } from './UploadVideo';
import { UploadDocument } from './UploadDocument';
import { upload } from '@testing-library/user-event/dist/upload';
import { verifyToken } from '../../api/CommonApi';
import { useNavigate } from 'react-router-dom';
import { Header } from '../common/Header';

export const AddProject = ({ startLoading, stopLoading }: { startLoading: () => void, stopLoading: (success?: boolean, message?: string) => void }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [documentIds, setDocumentIds] = useState<number[]>([]);
    const [error, setError] = useState('');
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
    const [projectCreate, setProjectCreate] = useState<ProjectCreate>({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        submissionDate: new Date(),
        categoryId: 0,
        mentorIds: [],
        summary: '',
        memberIds: [],
        documentIds: [],
        description: ''
    });
    const navigate = useNavigate();
    useEffect(() => {
        verifyToken().then((response: any) => {
            if (response.status !== 200) {
                navigate('/login');
            }
            setIsLoading(false);
        })
    }, []);
    useEffect(() => {
        getAllCategory()
            .then(response => {
                const data = response.data;
                setCategories(data);
                document.title = "Thêm đồ án";
            })
            .catch(error => {
                console.log(error);
            });
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
        console.log("projectCreate", projectCreate);
        createProject(project).then((response: any) => {
            if (response.status !== 201) {
                alert(response.message);
                return;
            }
            console.log(response);
            startLoading();
            stopLoading(true, 'Thêm đồ án thành công');
            alert('Thêm thành công');
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

        }).catch((error: any) => {
            alert(error.message);
            startLoading();
            stopLoading(false, 'Thêm đồ án thất bại');
        });
        stopLoading();
    }



    return (
        <div>
            <Header />
            {!isLoading && <div className="container mt-5 box-add-project">
                <a className="back-button">
                    <i className="fas fa-arrow-left"></i>
                    Quay lại trang chủ
                </a>

                <h2 id='title'>Thêm đồ án</h2>
                <form id="projectForm">
                    <div className="form-group">
                        <label>
                            Tên đồ án <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div id='editor'></div>
                        <MyEditor
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
                                handleSetWaiting={handleSetWaiting}
                                label='Upload video'
                                waiting={waiting}
                                documentIds={documentIds}
                                setDocumentIds={setDocumentIds}
                            />
                        </div>
                        <div className='form-group col-md-6 col-12'>
                            <UploadDocument
                                handleSetWaiting={handleSetWaiting}
                                waiting={waiting}
                                label='Upload tài liệu'
                                documentIds={documentIds}
                                setDocumentIds={setDocumentIds}
                            />
                        </div>
                    </div>
                    <span id="add-project-error">{error}</span>
                    <button type="submit" onClick={handleAddProject} className="btn btn-info btn-add-project">Thêm Đồ Án
                        <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                </form>
            </div>}
        </div>
    );
}
