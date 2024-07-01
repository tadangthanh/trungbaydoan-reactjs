import { DocumentDTO } from "../../model/DocumentDTO";

interface PreviewCarouselProps {
    documents: DocumentDTO[];
}
export const PreviewCarousel: React.FC<PreviewCarouselProps> = ({ documents }) => {
    return (
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel"
            style={{ width: '100%', height: '500px' }}>
            <div className="carousel-inner" style={{ height: '100%' }}>
                {
                    documents.map((document, index) => {
                        if (document.type === 'IMAGE') {
                            return (
                                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={document.id}>
                                    <img src={`http://localhost:8080/api/v1/documents/view/${document.id}`}
                                        className="d-block w-100" alt="..." style={{ objectFit: 'cover', height: '100%' }} />
                                </div>
                            )
                        }
                        if (document.type === 'VIDEO') {
                            return (
                                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={document.id}>
                                    <video autoPlay={true} id="video-preview-upload" className="mt-2 col-12 col-md-12"
                                        style={{ objectFit: 'cover', height: '100%' }}
                                        src={`http://localhost:8080/api/v1/documents/video/${document.id}`} controls></video>
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
    )
}