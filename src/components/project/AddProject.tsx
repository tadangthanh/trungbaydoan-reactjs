import { useEffect, useState } from 'react';
import '../css/addproject.css';
import { getAllCategory } from '../../api/projectAPI/addproject';
import { Category } from '../../model/Category';
import { findAllStudentByEmail, findAllTeacherByEmail } from '../../api/user/UserAPI';
import { ProjectCreate } from '../../model/ProjectCreate';
import { User } from '../../model/User';
import MyEditor from '../../ckeditor/MyEditor';
import DateInput from '../date/DateInput';
import InputSuggestion from '../input/InputSuggestion';

export const AddProject = ({ startLoading, stopLoading }: { startLoading: () => void, stopLoading: (success?: boolean, message?: string) => void }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [documentIds, setDocumentIds] = useState<number[]>([]);
    const [error, setError] = useState('');
    const [memberIds, setMemberIds] = useState<number[]>([]);
    const [projectName, setProjectName] = useState('');
    const [projectSummary, setProjectSummary] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [mentorIds, setMentorIds] = useState<number[]>([]);
    const [projectCreate, setProjectCreate] = useState<ProjectCreate>({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        submissionDate: new Date(),
        categoryId: 0,
        mentorId: 0,
        summary: '',
        memberIds: []
    });
    useEffect(() => {
        document.title = "Thêm đồ án";
        // console.log("useEffect");
        getAllCategory()
            .then(response => {
                const data = response.data;
                setCategories(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    const handleEditorChangeProjectSummary = (newContent: string) => {
        setProjectSummary(newContent);
    };
    const handleEditorChangeProjectName = (newContent: string) => {
        setProjectName(newContent);
    };
    const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("projectName", projectName);
        // setProjectCreate({
        //     name: projectName,
        //     startDate: new Date(startDate),
        //     endDate: new Date(endDate),
        //     submissionDate: new Date(submissionDate),
        //     categoryId: Number(categoryId),
        //     mentorEmail: mentorEmail,
        //     summary: projectSummary
        // });
        // createProject(projectCreate).then(response => {
        //     if (response.status !== 201) {
        //         alert(response.message);
        //         return;
        //     }
        //     console.log(response);
        //     startLoading();
        //     stopLoading(true, 'Thêm đồ án thành công');
        // }).catch(error => {
        //     alert(error.message);
        //     startLoading();
        //     stopLoading(false, 'Thêm đồ án thất bại');
        // });
        // stopLoading();
    }
    // useEffect(() => {
    //     const handleKeyPress = (event: any) => {
    //         if (event.key === 'Enter') {
    //             event.preventDefault();
    //             const button = document.querySelector('.btn-add-project') as HTMLButtonElement;
    //             button.click();
    //         }
    //     };

    //     document.addEventListener('keydown', handleKeyPress);

    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, []);
    return (
        <div className="container mt-5">
            <a className="back-button">
                <i className="fas fa-arrow-left"></i>
                Quay lại trang chủ
            </a>

            <h2 id='title'>Thêm đồ án</h2>
            <form id="projectForm" onSubmit={handleAddProject}>
                <div className="form-group">
                    <label>Tên đồ án</label>
                    <div id='editor'></div>
                    <MyEditor
                        data={projectName}
                        onChange={handleEditorChangeProjectName}
                    />
                </div>
                <div className="form-group">
                    <label>Bản tóm tắt đồ án</label>
                    <MyEditor
                        data={projectSummary}
                        onChange={handleEditorChangeProjectSummary}
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
                    <label>Thể Loại</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-control" id="categorySelect"  >
                        <option value="">Chọn thể loại</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.id}>{category.name}</option>
                        ))}
                    </select>

                </div>
                <div className='form-group'>
                    <InputSuggestion
                        label='Người hướng dẫn'
                        data={mentorIds}
                        setData={setMentorIds}
                        request={findAllTeacherByEmail}
                        idPrefix='mentor'
                        placeholder='Nhập email người hướng dẫn'
                    />
                </div>
                <div className='form-group'>
                    <InputSuggestion
                        label='Thành viên thực hiện'
                        data={memberIds}
                        setData={setMemberIds}
                        request={findAllStudentByEmail}
                        idPrefix='member'
                        placeholder='Nhập email thành viên'
                    />
                </div>
                <span id="add-project-error">{error}</span>
                <button type="submit" className="btn btn-info btn-add-project">Thêm Đồ Án
                    <i className="button__icon fas fa-chevron-right"></i>
                </button>
            </form>
        </div>
    );
}
