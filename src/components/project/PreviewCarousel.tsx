
import { DocumentDTO } from "../../model/DocumentDTO";
import '../css/PreviewCarousel.css'

interface PreviewCarouselProps {
    documents: DocumentDTO[];
    videoRef: any;
    handleMediaClick: (type: string, url: string) => void;
    handleClose: () => void;
}
export const PreviewCarousel: React.FC<PreviewCarouselProps> = ({ documents, videoRef, handleMediaClick, handleClose }) => {
    return (
        <div>
            <div id="carouselExampleControls" className="carousel slide"
                style={{ width: '100%', overflow: 'hidden' }}>
                <div className="carousel-inner" style={{ height: '100%', }}>
                    {
                        documents.map((document, index) => {
                            if (document.type === 'IMAGE') {
                                return (
                                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={document.id}>
                                        <img title="Click vào để xem ảnh" onClick={() => handleMediaClick('IMAGE', document.url)}
                                            src={`${document.url}`}
                                            className="d-block w-100" alt="..." style={{ objectFit: 'cover', cursor: 'pointer', height: '100%' }} />
                                    </div>
                                )
                            }
                            if (document.type === 'VIDEO') {
                                return (
                                    <div className={`video-container carousel-item ${index === 0 ? 'active' : ''}`} key={document.id}>
                                        <video title="click vào để xem" onClick={() => handleMediaClick('VIDEO', document.url)} ref={videoRef} autoPlay={true} muted id="video-preview-upload" className="mt-2 col-12 col-md-12"
                                            style={{ objectFit: 'cover', cursor: 'pointer', height: '100%' }}
                                            src={`${document.url}`} controls></video>
                                    </div>
                                )
                            }
                            return null;
                        })
                    }
                </div>
                <button style={{ height: '100px', margin: 'auto' }} className="carousel-control-prev" type="button"
                    data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button style={{ height: '100px', margin: 'auto' }} className="carousel-control-next" type="button"
                    data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

        </div>
    )
}