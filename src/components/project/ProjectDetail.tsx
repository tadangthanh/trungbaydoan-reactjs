import { useParams } from "react-router-dom"
import { Header } from "../common/Header";
import { PreviewCarousel } from "./PreviewCarousel";
import { useEffect, useRef, useState } from "react";
import { DocumentDTO } from "../../model/DocumentDTO";
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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { SectionInfo } from "../user/SectionInfo";
import { Nav } from "react-bootstrap";
import { getAllDocumentByProjectId } from "../../api/documentAPI/DocumentAPI";
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
            if (res.status === 404) {
                window.location.href = "/error-not-found";
            }
            setProject({ ...project, ...res.data });
            document.title = convertHtmlToText(res.data.name);

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

    const convertHtmlToText = (html: string) => {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    const covertToHtml = (content: string) => {
        return { __html: content };
    }
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState({ type: '', url: '' });
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const handleMediaClick = (type: string, url: string) => {
        setSelectedMedia({ type, url });
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };
    useEffect(() => {
        // Lấy ra tất cả các thẻ img
        const images = document.querySelectorAll('img');
        // Thêm sự kiện cho từng thẻ img
        images.forEach(img => {
            img.addEventListener('click', () => handleMediaClick("IMAGE", img.src)); // Thêm sự kiện click với hàm callback
        });

        // Xóa sự kiện khi component bị hủy
        return () => {
            images.forEach(img => {
                img.removeEventListener('click', () => handleMediaClick("IMAGE", img.src)); // Xóa sự kiện click
            });
        };
    }, [project]); // useEffect chạy chỉ một lần sau khi component được render
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
                            handleMediaClick={handleMediaClick}
                            handleClose={handleClose}
                            documents={documents}
                            videoRef={videoRef}
                        />
                        <div id="project-content" className="mb-5" dangerouslySetInnerHTML={covertToHtml(project.description)}>
                        </div>
                        <Comment projectId={projectId} />
                    </div>
                    <WidgetRight
                        documents={documents}
                        categories={categories}
                        project={project}
                        members={members}
                    />
                </div>
            </div>
            <Dialog open={isOpen} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>Media Preview</DialogTitle>
                <DialogContent>
                    {selectedMedia.type === 'IMAGE' ? (
                        <img src={selectedMedia.url} alt="Preview" style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <video
                            ref={videoRef}
                            src={selectedMedia.url}
                            style={{ width: '100%' }}
                            controls
                            autoPlay
                        ></video>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}