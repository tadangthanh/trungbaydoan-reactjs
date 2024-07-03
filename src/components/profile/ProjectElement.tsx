import { Link } from "react-router-dom";
import { ProjectDTO } from "../../model/ProjectDTO";


interface ProjectElementProps {
    project: ProjectDTO;
}
export const ProjectElement: React.FC<ProjectElementProps> = ({ project }) => {
    const convertHtmlToText = (html: string) => {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    const covertToHtml = (content: string) => {
        return { __html: content };
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
                                    <span className="ms-2 team-date">{project.lastModifiedDate}</span>
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
                                <a className="dropdown-item" href="javascript: void(0);"
                                    data-bs-toggle="modal"
                                    data-bs-target=".bs-example-new-project"
                                    onClick={() => { }}>Edit</a>
                                <a className="dropdown-item" href="javascript: void(0);">Share</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item delete-item"
                                    onClick={() => { }}
                                    data-id="project-items-1"
                                    href="javascript: void(0);">Delete</a>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h5 className="mb-1 font-size-17 team-title"> <Link style={{ padding: '0' }} to={`/project/${project.id}`} className="nav-link">{convertHtmlToText(project.name)}</Link></h5>
                        <p className="text-muted mb-0 team-description">{convertHtmlToText(project.summary)}</p>
                    </div>
                    <div className="d-flex">
                        <div className="avatar-group float-start flex-grow-1 task-assigne">
                            <div className="avatar-group-item">
                                <a href="javascript: void(0);" className="d-inline-block"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    aria-label="Terrell Soto"
                                    data-bs-original-title="Terrell Soto">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                        alt="ád" className="rounded-circle avatar-sm" />
                                </a>
                            </div>
                            <div className="avatar-group-item">
                                <a href="javascript: void(0);" className="d-inline-block"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    aria-label="Ruhi Shah"
                                    data-bs-original-title="Ruhi Shah">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                        alt="ád" className="rounded-circle avatar-sm" />
                                </a>
                            </div>
                            <div className="avatar-group-item">
                                <a href="javascript: void(0);" className="d-block"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    data-bs-original-title="Denny Silva">
                                    <div className="avatar-sm">
                                        <div className="avatar-title rounded-circle bg-primary">
                                            D
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="align-self-end">
                            <span className={project.projectStatus === "PENDING" ? "badge badge-soft-warning p-2 team-status" : project.projectStatus === "APPROVED" ? "badge badge-soft-success p-2 team-status" : "badge badge-soft-danger p-2 team-status"}>{project.projectStatus}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}