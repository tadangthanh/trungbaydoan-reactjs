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
}
export const UploadDocument: React.FC<UploadDocumentProps> = ({ documentIds, setDocumentIds, label }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [stompClient, setStompClient] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
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
    // useEffect(() => {
    //     if (isConnected || stompClient) {
    //         // alert("Đã kết nối với server");
    //         return;
    //     };
    //     const socket = new SockJS('http://localhost:8080/ws');
    //     const client = over(socket);
    //     const headers = {
    //         Authorization: `Bearer ${getToken()}`
    //     };

    //     client.connect(headers, () => {
    //         setIsConnected(true);
    //         setStompClient(client);
    //         console.log("Đã kết nối với server!!!!!!!!!!!");
    //         client.subscribe('/topic/upload-progress/' + getEmailFromToken(), (message) => {
    //             const receivedProgress = parseInt(message.body);
    //             setProgress(receivedProgress);
    //         });
    //     }, (error) => {
    //         console.error('không thể kết nối tới websocket:', error);
    //         setIsConnected(false);
    //     });

    //     return () => {
    //         if (stompClient) {
    //             stompClient.disconnect(() => {
    //                 setIsConnected(false);
    //                 alert("Ngắt kết nối với server");
    //             });
    //         }
    //     };
    // }, [stompClient, isConnected]);
    const upload = async () => {
        if (files.length === 0) return;
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
                alert("Upload failed: " + result.message);
                setLoading(false);
                setIsUpload(false);
                setDocumentDTO([]);
                return;
            }
            setDocumentIds([...documentIds, ...extractIds(result.data)]);
            setFiles([]);
            setIsUpload(false);
            setDocumentDTO([...documentDTO, ...result.data]);
            setLoading(false);

            console.log('File uploaded successfully');
        } catch (error) {
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
                {!isUpload && !error && <button className="btn btn-secondary btn-upload-video" onClick={upload}>Upload</button>}
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
