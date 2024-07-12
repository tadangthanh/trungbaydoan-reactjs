import { useEffect, useState } from "react";
import { DocumentDTO } from "../../model/DocumentDTO";
import { ProjectDTO } from "../../model/ProjectDTO";
import { getAllDocumentByProjectId } from "../../api/documentAPI/DocumentAPI";
import { MemberDTO } from "../../model/MemberDTO";
import { getMemberByProjectId } from "../../api/members/MemberAPI";
import { Link } from "react-router-dom";
import logo from '../../assets/img/vnua.png';

interface ProjectHomePageProps {
    project: ProjectDTO;
    handleChangeCategoryIdSelected: (categoryName: string) => void;
}
export const ProjectHomePage: React.FC<ProjectHomePageProps> = ({ handleChangeCategoryIdSelected, project }) => {
    const [documents, setDocuments] = useState<DocumentDTO[]>([]);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    useEffect(() => {
        getMemberByProjectId(project.id).then(res => {
            setMembers(res.data);
        });
    }, [project.id]);
    useEffect(() => {
        getAllDocumentByProjectId(project.id).then(res => {
            if (res.status === 200) {
                setDocuments(res.data);
            }
        })
    }, []);

    const convertHtmlToText = (html: string) => {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    return (
        <div className="card-body">
            <div className="row">
                <div className="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                    <div id={`carouselExampleControls${project.id}`} className="carousel slide"
                        style={{ width: '100%', overflow: 'hidden' }}>
                        <div className="carousel-inner" style={{ height: '100%', }}>
                            {
                                documents.map((document, index) => {
                                    if (document.type === 'IMAGE') {
                                        return (

                                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={document.id}>
                                                <img
                                                    src={`${document.url}`}
                                                    className="d-block w-100" alt="..." style={{ objectFit: 'cover', height: '100%' }} />
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        {documents.filter(document => document.type === 'IMAGE').length > 1 &&
                            <div>
                                <button style={{ height: '100px', margin: 'auto' }} className="carousel-control-prev" type="button"
                                    data-bs-target={`#carouselExampleControls${project?.id}`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button style={{ height: '100px', margin: 'auto' }} className="carousel-control-next" type="button"
                                    data-bs-target={`#carouselExampleControls${project?.id}`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-6">
                    <h5><Link className="text-decoration-none" style={{ color: '#000', cursor: 'pointer' }} to={`/project/${project.id}`}>{convertHtmlToText(project.name)}</Link></h5>
                    <div className="d-flex flex-row">
                        <div className="text-danger mb-1 me-2">
                            {members.map((member, index) => {
                                return (
                                    index < 5 ? <Link key={member.id} title={member.memberName} to={`/profile/${member.email}`}><img src={member.avatarUrl ? member.avatarUrl : logo} alt="avatar" className="rounded-circle" style={{ width: '30px', height: '30px' }} /></Link> : "..."
                                )
                            })}
                        </div>
                    </div>
                    <div className="mt-1 mb-0 text-muted small">
                        <span>Thể loại</span>
                        <span className="text-primary"> : </span>
                        {/* <span>{project.categoryName}</span> */}
                        <a onClick={() => handleChangeCategoryIdSelected(project.categoryName)} href="#">{project.categoryName}</a>
                        <span className="text-primary"> • </span>
                        <span>Số lượng thành viên</span>
                        <span className="text-primary"> : </span>
                        <span>{members.length}</span>

                    </div>
                    <div className="mb-2 text-muted small">
                        <span>Ngày nộp</span>
                        <span className="text-primary"> : </span>
                        <span>{new Date(project.createdDate).toLocaleString()}</span>
                        <span className="text-primary"> • </span>
                        <span>For men</span>
                        <span className="text-primary"> • </span>
                        <span>Casual<br /></span>
                    </div>
                    <p className="text-truncate mb-4 mb-md-0">
                        {convertHtmlToText(project.summary)}
                    </p>
                </div>
                {/* <div className="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                    <div className="d-flex flex-row align-items-center mb-1">
                        <h5 className="mb-1 me-1">Thành viên</h5>
                    </div>
                    <div className="d-flex flex-column mt-2">
                        {members.map((member, index) => {
                            return (
                                <div key={index} className="d-flex flex-row align-items-center mb-2">
                                    <img src={member.avatarUrl} alt="avatar" className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                                    <span className="ms-2">{member.memberName}</span>
                                </div>
                            )
                        })}
                    </div>
                </div> */}
            </div>
        </div>
    )
}