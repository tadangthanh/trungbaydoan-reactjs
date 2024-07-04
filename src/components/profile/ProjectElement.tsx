import { Link } from "react-router-dom";
import { ProjectDTO } from "../../model/ProjectDTO";
import { useEffect, useState } from "react";
import { MemberDTO } from "../../model/MemberDTO";
import { getMemberByProjectId } from "../../api/members/MemberAPI";
import logo from '../../assets/img/vnua.png';

interface ProjectElementProps {
    project: ProjectDTO;
}
export const ProjectElement: React.FC<ProjectElementProps> = ({ project }) => {
    const convertHtmlToText = (html: string) => {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    const [members, setMembers] = useState<MemberDTO[]>([]);
    useEffect(() => {
        getMemberByProjectId(project.id).then(res => {
            setMembers(res.data);
        });
    }, [project.id]);
    const convertDateTime = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    }
    return (
        <div className="col-md-6" id="project-items-1">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex mb-3">
                        <div className="flex-grow-1 align-items-start">
                            <div>
                                <h6 className="mb-0 text-muted">
                                    <i className={project.projectStatus === "PENDING" ? "fa-solid fa-circle text-warning" : project.projectStatus === "APPROVED" ? "fa-solid fa-circle text-success" : "fa-solid fa-circle text-secondary"}></i>
                                    <span title="Thời gian chỉnh sửa gần nhất" className="ms-2 team-date">{convertDateTime(project.lastModifiedDate)}</span>
                                </h6>
                            </div>
                        </div>
                        <div className="dropdown ms-2">
                            <a href="#" className="dropdown-toggle font-size-16 text-muted"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                <i className="mdi mdi-dots-horizontal"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                                <a className="dropdown-item"
                                    data-bs-toggle="modal"
                                    data-bs-target=".bs-example-new-project"
                                >Edit</a>
                                <a className="dropdown-item" >Share</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item delete-item"
                                    data-id="project-items-1"
                                >Delete</a>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h5 className="mb-1 font-size-17 team-title"> <Link style={{ padding: '0' }} to={`/project/${project.id}`} className="nav-link">{convertHtmlToText(project.name)}</Link></h5>
                        <p className="text-muted mb-0 team-description">{convertHtmlToText(project.summary)}</p>
                    </div>
                    <div className="d-flex">
                        <div className="avatar-group float-start flex-grow-1 task-assigne">
                            {members.map((member, index) => {
                                return (<div key={member.id} className="avatar-group-item">
                                    <Link to={`/profile/${member.email}`} className="d-inline-block"
                                        title={member.memberName}
                                        data-bs-toggle="tooltip" data-bs-placement="top"
                                        aria-label="Terrell Soto"
                                        data-bs-original-title="Terrell Soto">
                                        <img src={member.avatarUrl ? member.avatarUrl : logo}
                                            alt="ád" className="rounded-circle avatar-sm" />

                                    </Link>
                                </div>)
                            })}
                        </div>
                        <div className="align-self-end">
                            <span title="project status" className={project.projectStatus === "PENDING" ? "badge badge-soft-warning p-2 team-status" : project.projectStatus === "APPROVED" ? "badge badge-soft-success p-2 team-status" : "badge badge-soft-danger p-2 team-status"}>{project.projectStatus}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}