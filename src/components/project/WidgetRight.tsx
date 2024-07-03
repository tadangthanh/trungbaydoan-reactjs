import { useEffect, useState } from "react";
import { Category } from "../../model/Category";
import { ProjectDTO } from "../../model/ProjectDTO";
import '../css/WidgetRight.css'
import { GroupDTO } from "../../model/GroupDTO";
import { getGroupByProjectId } from "../../api/groups/GroupAPI";
import { MemberDTO } from "../../model/MemberDTO";
import { SectionInfo } from "../user/SectionInfo";
import { getBaseUrl } from "../../api/CommonApi";
import { DocumentDTO } from "../../model/DocumentDTO";
import { getAllDocumentByProjectId } from "../../api/documentAPI/DocumentAPI";
import { Link } from "react-router-dom";
interface WidgetRightProps {
    categories: Category[];
    project: ProjectDTO;
    members: MemberDTO[];
    documents: DocumentDTO[];
}
export const WidgetRight: React.FC<WidgetRightProps> = ({ categories, project, documents, members }) => {
    const chunkArray = (arr: any, chunkSize: any) => {
        const results = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            results.push(arr.slice(i, i + chunkSize));
        }
        return results;
    };
    console.log("project", project)
    const chunks = chunkArray(categories, 4);
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
                <div className="card-header">Categories</div>
                <div className="card-body">
                    {chunks.map((chunk, index) => (
                        <div className="row mb" key={index}>
                            {chunk.map((category: any, idx: number) => (
                                <div className="col-sm-6" key={idx}>
                                    <ul className="list-unstyled mb-0">
                                        <li><a href="#!">{category.name}</a></li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {/* <!-- Side widget--> */}
            <div className="card mb-4">
                <div className="card-header">Tài liệu</div>
                <div className="card-body">
                    <ol id="document-project-detail">
                        {documents.filter(document => document.type !== 'IMAGE' && document.type !== 'VIDEO').map((document, index) => (
                            document.type === 'PDF' ? <li key={index}><a target="_blank" rel="noopener noreferrer" href={`${getBaseUrl()}/documents/view/${document.id}`}>{document.name}</a></li> :
                                <li key={index}><a rel="noopener noreferrer" href={`${document.url}`}>{document.name}</a></li>
                        ))}
                    </ol>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-header">Thông tin đồ án</div>
                <div className="card-body">
                    <label htmlFor="">Giáo viên hướng dẫn:</label>
                    <ul id="mentors">
                        {project.mentorNames?.map((mentor, index) => (
                            <li key={index}><a href="">{mentor}</a></li>
                        ))}
                    </ul>
                    <label htmlFor="">Thành viên:</label>

                    {members?.map((member, index) => (
                        <ul key={index} className="members">
                            <li title="Ấn vào để xem thông tin" id={`${member.id}`}><Link to={`/profile/${member.email}`}>{member.memberName}</Link>({member.role.split("_")[1].toLowerCase()})
                            </li>
                            <li>Email: {member.email}</li>
                            <li>Khoá: {member.academicYear}</li>
                            <li>Lớp: {member.className}</li>
                            <li>Khoa: {member.major}</li>
                            <li>Chuyên ngành: {member.department}</li>
                        </ul>

                    ))}
                    <label htmlFor="">Ngày bắt đầu:</label>
                    <p>{project.startDate}</p>
                    <label htmlFor="">Ngày kết thúc:</label>
                    <p>{project.endDate}</p>
                    <label htmlFor="">Ngày nộp:</label>
                    <p>{project.submissionDate}</p>
                    <label htmlFor="">Người duyệt:</label>
                    <p><a href="">{project.approverName}</a></p>
                    <label htmlFor="">Khóa:</label>
                    <p>{project.academicYear}</p>
                    <label htmlFor="">Ngày chỉnh sửa gần nhất:</label>
                    <p>{project.lastModifiedDate}</p>
                </div>
            </div>

        </div>
    )
}