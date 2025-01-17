import { useEffect, useState } from "react";
import { Category } from "../../model/Category";
import { ProjectDTO } from "../../model/ProjectDTO";
import '../css/WidgetRight.css'
import { MemberDTO } from "../../model/MemberDTO";
import { apiUrl, getEmailFromToken, verifyAdmin, verifyToken } from "../../api/CommonApi";
import { DocumentDTO } from "../../model/DocumentDTO";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../model/User";
import { getMentorsByProjectId } from "../../api/projectAPI/ProjectAPI";
import { WidgetRightAdmin } from "./WidgetRightAdmin";
import { UploadDocument } from "./UploadDocument";
import { UploadVideo } from "./UploadVideo";
import { TechnologyDTO } from "../../model/TechnologyDTO";
import { getAllTechnology, getAllTechnologyByIdIn } from "../../api/technology/TechnologyAPI";
interface WidgetRightProps {
    categories: Category[];
    handleSetIdsDelete: (ids: number) => void;
    project: ProjectDTO;
    members: MemberDTO[];
    setIsEditContent: (isEditContent: boolean) => void;
    documents: DocumentDTO[];
    handleRemoveIdsDelete: (ids: number) => void;
    handleCancelUpdate: () => void;
    isEditContent: boolean;
    handleSetDocumentIds: (id: number) => void;
    handleDeleteDocumentIds: (id: number) => void;
    waiting: boolean;
    handleSetWaiting: (value: boolean) => void;
    setDocumentIds: (documentIds: number[]) => void;
}
export const WidgetRight: React.FC<WidgetRightProps> = ({ handleCancelUpdate, handleRemoveIdsDelete, handleSetIdsDelete, handleDeleteDocumentIds, handleSetDocumentIds, handleSetWaiting, waiting, setIsEditContent, setDocumentIds, isEditContent, categories, project, documents, members }) => {
    const chunkArray = (arr: any, chunkSize: any) => {
        const results = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            results.push(arr.slice(i, i + chunkSize));
        }
        return results;
    };
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [memberRole, setMemberRole] = useState(members.filter(member => member.email === getEmailFromToken())[0]?.role);
    const [technologies, setTechnologies] = useState<TechnologyDTO[]>([]);

    useEffect(() => {
        getAllTechnologyByIdIn(project.idsTechnology || [0]).then(res => {
            if (res.status === 200) {
                setTechnologies(res.data);
            }
        })
    }, [])
    const navigate = useNavigate();
    useEffect(() => {
        verifyToken().then(res => {
            if (res.status === 200) {
                setIsLogin(true);
                verifyAdmin().then(res => {
                    if (res.status === 200) {
                        setIsAdmin(true);
                    }
                });
            }
        })
    }, []);
    const [mentors, setMentors] = useState<User[]>([]);
    useEffect(() => {
        getMentorsByProjectId(project.id || 0).then(res => {
            setMentors(res.data);
        })
    }, [project.id])
    const chunks = chunkArray(categories, 4);
    const getDocumentType = (mimeType: string): string => {
        const mimeTypesMap: { [key: string]: string } = {
            'application/msword': 'word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word text-primary',
            'application/vnd.ms-excel': 'Excel Spreadsheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel text-success',
            'application/pdf': 'pdf text-danger'
        };
        return mimeTypesMap[mimeType] || 'file';
    };
    const handleCategory = (categoryName: string) => {
        navigate(`/`, { state: { categoryName: categoryName } });
    }
    return (
        <div className="col-lg-4">
            {/* <!-- Search widget--> */}
            <div className="card mb-4">
                <div className="card-header">Search</div>
                <div className="card-body">
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Nhập tìm kiếm..."
                            aria-label="Nhập tìm kiếm..." aria-describedby="button-search" />
                        <button className="btn btn-primary" id="button-search" type="button"><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </div>
            {/* <!-- Categories widget--> */}
            <div className="card mb-4">
                <div className="card-header"><i className="me-1 fa-solid fa-list"></i>Danh sách thể loại</div>
                <div className="card-body">
                    {chunks.map((chunk, index) => (
                        <div className="row mb" key={index}>
                            {chunk.map((category: any, idx: number) => (
                                <div className="col-sm-6" key={idx}>
                                    <ul className="list-unstyled mb-0">
                                        <li onClick={() => handleCategory(category.name)}><a href="#">{category.name}</a></li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {/* <!-- Side widget--> */}
            <div className="card mb-4">
                <div className="card-header"><i className="me-1 fa-regular fa-file"></i>{!isEditContent ? "Tài liệu" : "Tích vào tài liệu cần xóa"}</div>
                <div className="card-body">
                    <ol id="document-project-detail">
                        {documents.filter(document => document.type !== 'IMAGE' && document.type !== 'VIDEO').map((document, index) => (
                            <li key={index}><a target="_blank" rel="noopener noreferrer" href={`${apiUrl}/documents/view/${document.id}`}><i className={`me-1 fa-solid fa-file-${getDocumentType(document.mimeType)}`}></i>{document.name}</a>  {isEditContent && <input value={document.id} onChange={(e) => { e.target.checked ? handleSetIdsDelete(document.id) : handleRemoveIdsDelete(document.id) }} className="form-check-input" type="checkbox" style={{ cursor: 'pointer' }} />}</li>
                        ))}
                    </ol>
                </div>
            </div>
            {isEditContent &&
                <div className="card mb-4">
                    <div className="card-header"><i className="me-1 fa-regular fa-file"></i>Thêm tài liệu</div>
                    <div className="p-2"> <UploadDocument handleDeleteDocumentIds={handleDeleteDocumentIds} handleSetDocumentIds={handleSetDocumentIds} handleSetWaiting={handleSetWaiting} documentIds={documents.map(dcm => dcm.id)} setDocumentIds={setDocumentIds} waiting={waiting} label="Thêm tài liệu" /></div>
                </div>
            }
            {isEditContent &&
                <div className="card mb-4">
                    <div className="card-header"><i className="me-1 fa-solid fa-video"></i>Thay đổi Video</div>
                    <div className="p-2"> <UploadVideo handleDeleteDocumentIds={handleDeleteDocumentIds} handleSetDocumentIds={handleSetDocumentIds} handleSetWaiting={handleSetWaiting} documentIds={documents.map(dcm => dcm.id)} setDocumentIds={setDocumentIds} waiting={waiting} label="Thay đổi video" /></div>
                </div>
            }
            {!isEditContent &&
                <div className="card mb-4">
                    <div className="card-header"><i className="me-1 fa-solid fa-circle-info"></i>Thông tin đồ án</div>
                    <div className="card-body">
                        <label htmlFor=""><i className="me-1 fa-solid fa-user"></i>Giáo viên hướng dẫn:</label>
                        <ul id="mentors">
                            {mentors?.map((mentor, index) => (
                                <li key={index}><Link to={`/profile/${mentor.email}`}>{mentor.fullName}</Link></li>
                            ))}
                        </ul>
                        <label htmlFor=""><i className="me-1 fa-solid fa-user-group"></i>Thành viên:</label>

                        {members?.map((member, index) => (
                            <ul key={index} className="members m-0">
                                <li title="Ấn vào để xem thông tin" id={`${member.id}`}><Link to={`/profile/${member.email}`}>{member.memberName}</Link>({member.role.split("_")[1].toLowerCase()})
                                </li>
                            </ul>

                        ))}
                        <label htmlFor=""><i className="me-1 fa-solid fa-calendar-days"></i>Ngày bắt đầu:</label>
                        <p>{project.startDate}</p>
                        <label htmlFor=""><i className="me-1 fa-solid fa-calendar-days"></i>Ngày kết thúc:</label>
                        <p>{project.endDate}</p>
                        <label htmlFor=""><i className="me-1 fa-solid fa-calendar-days"></i>Ngày nộp:</label>
                        <p>{project.submissionDate}</p>
                        <label htmlFor=""><i className="me-1 fa-solid fa-user"></i>Người duyệt:</label>
                        <p>{project.approverName}</p>
                        <label htmlFor=""><i className="me-1 fa-solid fa-calendar-days"></i>Khóa:</label>
                        <p>{project.academicYear}</p>
                        <label htmlFor=""><i className="me-1 fa-solid fa-calendar-days"></i>Ngày cập nhật gần nhất:</label>
                        <p>{project.lastModifiedDate}</p>
                        <label htmlFor=""><i className="me-1 fa-solid fa-microchip"></i>Công nghệ sử dụng:</label> <br />
                        {technologies.map((technology, index) => (
                            <span key={index}>{technology.name} <i className={`${technology.acronym}`}></i>{index !== technologies.length - 1 && <span>, </span>}</span>
                        ))}
                    </div>

                </div>}
            {(isAdmin || memberRole === "ROLE_LEADER") && isLogin && <WidgetRightAdmin isAdmin={isAdmin} memberRole={memberRole} project={project} handleCancelUpdate={handleCancelUpdate} setIsEditContent={setIsEditContent} isEditContent={isEditContent} />}

        </div>
    )
}