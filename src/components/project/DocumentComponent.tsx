import { DocumentDTO } from "../../model/DocumentDTO";
interface DocumentComponentProps {
    id: number;
    setDocumentRemoveId: (id: number) => void;
    setDocumentDTO: (documentDTO: DocumentDTO[]) => void;
    documentDTO: DocumentDTO[];
    name: string;
    size: string;
}
export const DocumentComponent: React.FC<DocumentComponentProps> = ({ name, size, id, setDocumentRemoveId, documentDTO, setDocumentDTO }) => {
    return (
        <div className="document-item d-flex">
            <button title="Xóa file này" className="btn text-center" onClick={() => {
                setDocumentRemoveId(id)
                setDocumentDTO(documentDTO.filter(doc => doc.id !== id))
            }}>
                <i className="fa-solid fa-trash " ></i>
            </button>
            <div className="document-container">
                <span className="document-name">  {name}</span>
                <span className="document-size">: {size}</span>
            </div>
        </div>
    )
};