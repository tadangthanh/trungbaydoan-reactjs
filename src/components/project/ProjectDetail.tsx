import { useParams } from "react-router-dom"
import { Header } from "../common/Header";
import { PreviewCarousel } from "./PreviewCarousel";
import { useEffect, useState } from "react";
import { DocumentDTO } from "../../model/DocumentDTO";
import { getAllDocumentByProjectId } from "../../api/documents/DocumentAPI";
import { get } from "jquery";
import { getProjectById } from "../../api/projectAPI/ProjectAPI";
import { ProjectDTO } from "../../model/ProjectDTO";
import '../css/project-detail.css'
import { Comment } from "../comment/Comment";
import { WidgetRight } from "./WidgetRight";
import { Category } from "../../model/Category";
import { getAllCategory } from "../../api/categoryAPI/GetAllCategoryAPI";
import { getGroupByProjectId } from "../../api/groups/GroupAPI";
import { GroupDTO } from "../../model/GroupDTO";
import { MemberDTO } from "../../model/MemberDTO";
import { getMemberByProjectId } from "../../api/members/MemberAPI";
import '../css/ProjectDetail.css'
export const ProjectDetail = () => {
    const { id } = useParams();
    const projectId = Number(id);
    const [project, setProject] = useState({
        id: 0,
        approverName: "",
        name: "",
        description: "",
        createdDate: "",
        categoryName: "",
        mentorNames: [],
        documentIds: [],
        groupId: 0,
        academicYear: 0,
        memberNames: [],
        startDate: "",
        endDate: "",
        projectStatus: "",
        submissionDate: "",
        summary: "",
        categoryId: 0,
        approverId: 0,
        mentorIds: [],
        createdBy: "",
        lastModifiedDate: "",
        lastModifiedBy: ""
    }
    );
    const [documents, setDocuments] = useState<DocumentDTO[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    useEffect(() => {
        getAllDocumentByProjectId(projectId).then(res => {
            setDocuments(res.data);
        });
    }, [projectId]);
    useEffect(() => {
        getProjectById(projectId).then(res => {
            setProject({ ...project, ...res.data });
        });
    }, [projectId]);
    useEffect(() => {
        getMemberByProjectId(projectId).then(res => {
            setMembers(res.data);
        });
    }, [projectId]);
    useEffect(() => {
        getAllCategory().then(res => {
            setCategories(res.data);
        });
    }, []);
    const [group, setGroup] = useState({} as GroupDTO);
    useEffect(() => {
        getGroupByProjectId(projectId).then(res => {
            setGroup(res.data);
        });
    }, [projectId]);
    const convertHtmlToText = (html: string) => {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    const covertToHtml = (content: string) => {
        return { __html: content };
    }


    return (
        <div>
            <Header />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8">
                        {/* header */}
                        <header className="mb-4">
                            <h1 className="fw-bolder mb-1">{convertHtmlToText(project.name)}</h1>
                            <div className="text-muted fst-italic mb-2">Posted on {project.createdDate}</div>
                            <a className="badge bg-secondary text-decoration-none link-light" href="#!">{project.categoryName}</a>
                        </header>
                        {/* preview */}
                        <PreviewCarousel
                            documents={documents}
                        />
                        <div id="project-content" className="mb-5" dangerouslySetInnerHTML={covertToHtml(project.description)}>
                        </div>
                        <Comment projectId={projectId} />
                    </div>
                    <WidgetRight
                        categories={categories}
                        project={project}
                        members={members}
                    />
                </div>
            </div>
        </div>
    )
}