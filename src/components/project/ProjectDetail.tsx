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
import { MemberDTO } from "../../model/MemberDTO";
import { getMemberByProjectId } from "../../api/members/MemberAPI";
import '../css/ProjectDetail.css'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { FaArrowUp } from 'react-icons/fa';
import { getAllDocumentByProjectId } from "../../api/documentAPI/DocumentAPI";
export const ProjectDetail = () => {
    const { id } = useParams();
    const projectId = Number(id);
    const [project, setProject] = useState({
        // id: 0,
        // approverName: "",
        // name: "",
        // description: "",
        // createdDate: "",
        // categoryName: "",
        // mentorNames: [],
        // documentIds: [],
        // groupId: 0,
        // academicYear: 0,
        // memberNames: [],
        // startDate: "",
        // endDate: "",
        // projectStatus: "",
        // submissionDate: "",
        // summary: "",
        // categoryId: 0,
        // approverId: 0,
        // mentorIds: [],
        // createdBy: "",
        // lastModifiedDate: "",
        // lastModifiedBy: ""
    } as ProjectDTO
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
        setIsZoomed(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };
    useEffect(() => {
        // Lấy ra tất cả các thẻ img
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.loading = 'lazy';
            img.title = 'Click để xem ảnh';
        });
        images.forEach(img => {
            img.addEventListener('click', () => handleMediaClick("IMAGE", img.src));
        });
        return () => {
            images.forEach(img => {
                img.removeEventListener('click', () => handleMediaClick("IMAGE", img.src));
            });
        };
    }, [project]); // useEffect chạy chỉ một lần sau khi component được render
    const contentRef = useRef<HTMLDivElement | null>(null);
    const progressBar = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleScroll = () => {
            const scrollValue = window.scrollY;
            const contentHeight = contentRef.current?.clientHeight || 0;
            const windowHeight = window.innerHeight;
            const scrollPercent = (scrollValue / (contentHeight - windowHeight)) * 100;
            if (progressBar.current) {
                progressBar.current.style.width = `${scrollPercent}%`;
            }
        };

        document.addEventListener('scroll', handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const [isZoomed, setIsZoomed] = useState(false);
    const handleDoubleClick = () => {
        setIsZoomed(!isZoomed);
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    useEffect(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    return (
        <div id="content" ref={contentRef}>
            <Header />
            <div id="progress-container">
                <div id="progress-bar" ref={progressBar}></div>

            </div>
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
            <Dialog style={{ zIndex: '4000' }} open={isOpen} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>Media Preview</DialogTitle>
                <DialogContent>
                    {selectedMedia.type === 'IMAGE' ? (
                        <img
                            src={selectedMedia.url}
                            alt="Preview"
                            style={{
                                width: isZoomed ? '200%' : '100%',
                                height: isZoomed ? '200%' : '100%',
                                cursor: 'zoom-in',
                            }}
                            onDoubleClick={handleDoubleClick}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            src={selectedMedia.url}
                            style={{
                                width: isZoomed ? '200%' : '100%',
                                height: isZoomed ? '200%' : '100%',
                                cursor: 'zoom-in',
                            }}
                            controls
                            autoPlay
                            onDoubleClick={handleDoubleClick}
                        ></video>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            {/* Scroll to top button */}
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
    )
}