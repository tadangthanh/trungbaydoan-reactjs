import { useLocation, useParams } from "react-router-dom"
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
import MyEditor from "../../ckeditor/MyEditor";
import { requestWithPostFile } from "../../api/CommonApi";
export const ProjectDetail = () => {
    const { id } = useParams();
    const projectId = Number(id);
    const [project, setProject] = useState({} as ProjectDTO);
    const [documents, setDocuments] = useState<DocumentDTO[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [status, setStatus] = useState(false);
    useEffect(() => {
        getAllDocumentByProjectId(projectId).then(res => {
            setDocuments(res.data);
        });
    }, [projectId]);
    useEffect(() => {
        getProjectById(projectId).then(res => {
            if (res.status !== 200) {
                window.location.href = "/error-not-found";
            }
            setProject({ ...project, ...res.data });
            setStatus(true);
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
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeName === 'FIGURE') {
                        handleImageDeletion(node);
                    }
                });
            }
        }
    });
    function handleImageDeletion(node: any) {
        console.log('Image deleted:', node.getElementsByTagName('img')[0].src);
    }
    const contentEdit = document.getElementById('content-edit');
    if (contentEdit) {
        observer.observe(contentEdit, { childList: true, subtree: true });

    }
    useEffect(() => {
        // Lấy ra tất cả các thẻ img
        const images = document.querySelectorAll('img:not(.img-profile)');
        images.forEach(img => {
            if (!img.classList.contains('abc')) {
                const imageElement = img as HTMLImageElement;
                imageElement.style.cursor = 'pointer';
                imageElement.loading = 'lazy';
                imageElement.title = 'Click để xem ảnh';
            }

        });
        images.forEach(img => {
            const imageElement = img as HTMLImageElement;
            imageElement.addEventListener('click', () => handleMediaClick("IMAGE", imageElement.src));
        });
        return () => {
            images.forEach(img => {
                const imageElement = img as HTMLImageElement;
                imageElement.removeEventListener('click', () => handleMediaClick("IMAGE", imageElement.src));
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

    const handleChangeName = (newName: string) => {
        setProject({ ...project, name: newName });
    }
    const handleChangeContent = (newContent: string) => {
        setProject({ ...project, description: newContent });
    }
    const handleSetDocumentIds = (id: number) => {

    }
    const [documentIds, setDocumentIds] = useState<number[]>([]);
    const handleUpdateProject = (id: number) => {
        console.log(project);
    }
    const [waiting, setWaiting] = useState(false);
    const [isEditContent, setIsEditContent] = useState(false);
    const handleSetWaiting = (value: boolean) => {
        setWaiting(value);
    }
    return (
        <div>
            {status && <div id="content" ref={contentRef}>
                <div id="progress-container" style={{ zIndex: "10000" }}>
                    <div id="progress-bar" ref={progressBar}></div>
                </div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-lg-8">
                            <div>
                                {isEditContent && (
                                    <div style={{ width: '100%', zIndex: '5000', top: '0', position: 'relative' }}>
                                        <MyEditor
                                            data={project.name}
                                            onChange={handleChangeName}
                                            uploadImage={false}
                                            handleSetDocumentIds={handleSetDocumentIds}
                                        />
                                    </div>
                                )}
                            </div>
                            {!isEditContent && (
                                <div>
                                    <header className="mb-4">
                                        <h1 className="fw-bolder mb-1">{convertHtmlToText(project?.name)}</h1>
                                        <div className="text-muted fst-italic mb-2">Posted on {project?.createdDate}</div>
                                        <a className="badge bg-secondary text-decoration-none link-light" href="#!">
                                            {project?.categoryName}
                                        </a>
                                    </header>
                                    <PreviewCarousel
                                        handleMediaClick={handleMediaClick}
                                        handleClose={handleClose}
                                        documents={documents}
                                        videoRef={videoRef}
                                    />
                                </div>
                            )}
                            {!isEditContent && (
                                <div id="project-content" className="mb-5" dangerouslySetInnerHTML={covertToHtml(project?.description)}></div>
                            )}
                            <div id="content-edit">
                                {isEditContent && (
                                    <div style={{ width: '100%', zIndex: '5000', top: '0', position: 'relative' }}>
                                        <MyEditor
                                            data={project.description}
                                            onChange={handleChangeContent}
                                            uploadImage={true}
                                            handleSetDocumentIds={handleSetDocumentIds}
                                        />
                                        <button
                                            onClick={() => handleUpdateProject(project.id)}
                                            className="d-flex m-auto mt-2 btn btn-outline-info"
                                        >
                                            Cập nhật
                                        </button>
                                        <button
                                            onClick={() => setIsEditContent(false)}
                                            className="d-flex m-auto mt-2 btn btn-outline-danger"
                                        >
                                            Huỷ cập nhật
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!isEditContent && <Comment projectId={projectId} />}
                        </div>

                        <WidgetRight
                            waiting={waiting}
                            handleSetWaiting={handleSetWaiting}
                            isEditContent={isEditContent}
                            setIsEditContent={setIsEditContent}
                            documents={documents}
                            categories={categories}
                            project={project}
                            members={members}
                            setDocumentIds={setDocumentIds}
                        />
                    </div>
                </div>
                <Dialog style={{ zIndex: '8000' }} open={isOpen} onClose={handleClose} maxWidth="lg" fullWidth>
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
            </div>}
        </div>
    )
}