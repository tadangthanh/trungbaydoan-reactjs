import React, { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { getToken } from "../../api/AuthenticationApi";
import '../css/uploadfile.css';
import { DocumentResponse } from "../../model/DocumentResponse";
import { deleteDocument } from "../../api/documentAPI/DocumentAPI";
import { getEmailFromToken } from "../../api/CommonApi";
import { DocumentDTO } from "../../model/DocumentDTO";
import { DocumentComponent } from "./DocumentComponent";
interface UploadDocumentProps {
    label: string;
    documentIds: number[];
    setDocumentIds: (documentIds: number[]) => void;
    handleSetWaiting: (value: boolean) => void;
    waiting: boolean;
}
export const UploadDocument: React.FC<UploadDocumentProps> = ({ documentIds, waiting, setDocumentIds, label, handleSetWaiting }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const [documentDTO, setDocumentDTO] = useState<DocumentDTO[]>([]);
    const [documentRemoveId, setDocumentRemoveId] = useState<number>(0);
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
                    return;
                }
            }
        }
    };
    const checkFileName = (fileName: string) => {
        for (let i = 0; i < documentDTO.length; i++) {
            if (documentDTO[i].name === fileName) {
                setError("File đã tồn tại");
                return false;
            }
        }
        return true;
    }
    useEffect(() => {
        if (!files) setError('');
    }, [files]);
    const upload = async () => {
        if (files.length === 0) return;
        handleSetWaiting(true);
        setIsUpload(true);
        setLoading(true);
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('files', file);
        });
        try {
            const response = await fetch('http://localhost:8080/api/v1/documents/uploadAll', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const result = await response.json();

            if (response.status !== 200) {
                handleSetWaiting(false);
                alert("Upload failed: " + result.message);
                setLoading(false);
                setIsUpload(false);
                setDocumentDTO([]);
                return;
            }
            handleSetWaiting(false);
            setDocumentIds([...documentIds, ...extractIds(result.data)]);
            setFiles([]);
            setIsUpload(false);
            setDocumentDTO([...documentDTO, ...result.data]);
            setLoading(false);

            console.log('File uploaded successfully');
        } catch (error) {
            handleSetWaiting(false);
            console.error('Error uploading file', error);
            setLoading(false);
        }
    };



    useEffect(() => {
        setLoading(true);
        deleteDocument(documentRemoveId)
            .then(response => {
                if (response.status !== 200) {
                    alert(response.message);
                    setLoading(false);
                    return;
                }
                setDocumentIds(documentIds.filter(id => id !== documentRemoveId));
                clearFile();
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    }, [documentRemoveId]);
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
            <label className="mb-4 text-center">{label}<i className="mr-2 fa-solid fa-cloud-arrow-up"></i></label>
            <div className="upload-file-area">
                {!isUpload && <input accept=".pdf,.doc,.docx,.xls,.xlsx" ref={inputRef} type="file" multiple onChange={handleFileChange} />}
                {!isUpload && !error && !waiting && <button className="btn btn-secondary btn-upload-video" onClick={upload}>Upload</button>}
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {loading && <div className="loader"></div>}
            {documentDTO.map(document => (
                <DocumentComponent
                    key={document.id}
                    id={document.id}
                    setDocumentRemoveId={setDocumentRemoveId}
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
