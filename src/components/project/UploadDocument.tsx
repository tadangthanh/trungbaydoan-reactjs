import React, { useEffect, useRef, useState } from "react";
import { getToken } from "../../api/AuthenticationApi";
import '../css/uploadfile.css';
import { deleteDocument } from "../../api/documentAPI/DocumentAPI";
import { apiUrl } from "../../api/CommonApi";
import { DocumentDTO } from "../../model/DocumentDTO";
import { DocumentComponent } from "./DocumentComponent";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../common/LoadingSpinner";
interface UploadDocumentProps {
    label: string;
    documentIds: number[];
    setDocumentIds: (documentIds: number[]) => void;
    handleSetDocumentIds: (id: number) => void;
    handleSetWaiting: (value: boolean) => void;
    handleDeleteDocumentIds: (id: number) => void;
    waiting: boolean;
}
export const UploadDocument: React.FC<UploadDocumentProps> = ({ handleDeleteDocumentIds, handleSetDocumentIds, documentIds, waiting, setDocumentIds, label, handleSetWaiting }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const [documentDTO, setDocumentDTO] = useState<DocumentDTO[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);
            const documentTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ];
            for (let i = 0; i < selectedFiles.length; i++) {
                checkFileName(selectedFiles[i].name.split(".")[0]);
                if (!documentTypes.includes(selectedFiles[i].type)) {
                    setError("Chỉ chấp nhận file pdf, word, excel");
                    toast.error("Chỉ chấp nhận file pdf, word, excel", { containerId: 'upload-document' });
                    return;
                }
            }
            upload(selectedFiles);
        }
    };
    const checkFileName = (fileName: string) => {
        for (let i = 0; i < documentDTO.length; i++) {
            if (documentDTO[i].name === fileName) {
                setError("File đã tồn tại");
                toast.error("File đã tồn tại", { containerId: 'upload-document' });
                return false;
            }
        }
        return true;
    }
    useEffect(() => {
        if (!files) setError('');
    }, [files]);
    const upload = async (files: File[]) => {
        if (files.length === 0) return;
        handleSetWaiting(true);
        setIsUpload(true);
        setLoading(true);
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('files', file);
        });
        try {
            const response = await fetch(`${apiUrl}/documents/uploadAll`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const result = await response.json();

            if (response.status !== 200) {
                handleSetWaiting(false);
                toast.error(result.message, { containerId: 'upload-document' });
                setLoading(false);
                setIsUpload(false);
                setDocumentDTO([]);
                return;
            }
            handleSetWaiting(false);
            extractIds(result.data).forEach(id => handleSetDocumentIds(id));
            // setDocumentIds([...documentIds, ...extractIds(result.data)]);
            setFiles([]);
            setIsUpload(false);
            setDocumentDTO([...documentDTO, ...result.data]);
            setLoading(false);
            toast.success('Upload file thành công', { containerId: 'upload-document' });
        } catch (error) {
            handleSetWaiting(false);
            toast.error('Upload file thất bại', { containerId: 'upload-document' });
            setLoading(false);
        }
        setLoading(false);
    };

    const handleRemoveDocument = (idRemove: number) => {
        setLoading(true);
        deleteDocument(idRemove)
            .then(response => {
                if (response.status !== 200) {
                    toast.error(response.message, { containerId: 'upload-document' });
                    setLoading(false);
                    return;
                }
                // setDocumentIds(documentIds.filter(id => id !== idRemove));
                handleDeleteDocumentIds(idRemove);
                clearFile();
                setLoading(false);
                toast.success('Xóa file thành công', { containerId: 'upload-document' });
            })
            .catch(error => {
                setLoading(false);
                toast.error('Xóa file thất bại', { containerId: 'upload-document' });
            });

    }
    const extractIds = (documentDTO: DocumentDTO[]) => {
        const ids = documentDTO.map(document => document.id);
        return ids;
    }

    const clearFile = () => {
        if (inputRef.current) {
            inputRef.current.value = ''; // Xóa giá trị của input
        }
        setFiles([]); // Reset state file
    }
    return (
        <div className="upload-container mt-5">
            <Loading loading={loading} />
            <ToastContainer containerId='upload-document' />
            <label className="mb-4 text-center">{label}<i className="mr-2 fa-solid fa-cloud-arrow-up"></i></label>
            <div className="upload-file-area">
                {!isUpload && <input accept=".pdf,.doc,.docx,.xls,.xlsx" ref={inputRef} type="file" multiple onChange={handleFileChange} />}
                {/* {!isUpload && !error && !waiting && <button className="btn btn-secondary btn-upload-video" onClick={upload}>Upload</button>} */}
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {loading && <div className="loader"></div>}
            {documentDTO.map(document => (
                <DocumentComponent
                    key={document.id}
                    id={document.id}
                    handleRemoveDocument={handleRemoveDocument}
                    documentDTO={documentDTO}
                    setDocumentDTO={setDocumentDTO}
                    name={document.name}
                    size={document.size}
                />
            ))
            }
        </div>
    );
};
