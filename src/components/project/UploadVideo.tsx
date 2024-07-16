import React, { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { getToken } from "../../api/AuthenticationApi";
import '../css/uploadfile.css';
import { DocumentResponse } from "../../model/DocumentResponse";
import { deleteDocument, uploadFile } from "../../api/documentAPI/DocumentAPI";
import { apiWsUrl } from "../../api/CommonApi";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../common/LoadingSpinner";
interface UploadVideoProps {
    label: string;
    documentIds: number[];
    setDocumentIds: (documentIds: number[]) => void;
    handleSetDocumentIds: (id: number) => void;
    handleSetWaiting: (value: boolean) => void;
    waiting: boolean;
    handleDeleteDocumentIds: (id: number) => void;
}
export const UploadVideo: React.FC<UploadVideoProps> = ({ handleDeleteDocumentIds, handleSetDocumentIds, documentIds, setDocumentIds, waiting, label, handleSetWaiting }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [documentResponse, setDocumentResponse] = useState<DocumentResponse>({
        id: 0,
        url: ''
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        if (event.target.files) {
            const file = event.target.files[0];
            setFile(file);
            const videoTypes = ["video/mp4", "video/avi", "video/mkv", "video/mov"];
            if (!videoTypes.includes(file?.type)) {
                setError("Chỉ chấp nhận file video có định dạng mp4, avi, mkv, mov");
                toast.error("Chỉ chấp nhận file video có định dạng mp4, avi, mkv, mov", { containerId: 'upload-video' });
                return;
            }
            upload(file);
        }
    };
    useEffect(() => {
        if (!file) setError('');
    }, [file]);
    const upload = async (file: File) => {
        if (!file) return;
        handleSetWaiting(true);
        setIsUpload(true);
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        uploadFile(formData).then(response => {
            if (response.status !== 201) {
                handleSetWaiting(false);
                toast.error(response.message, { containerId: 'upload-video' });
                setLoading(false);
                setIsUpload(false);
                setDocumentResponse({ id: 0, url: '' });
                return;
            }
            handleSetWaiting(false);
            handleSetDocumentIds(response.data.id);
            // setDocumentIds([...documentIds, response.data.id]);
            setFile(null);
            setIsUpload(false);
            setDocumentResponse(response.data);
            setLoading(false);
            toast.success(response.message, { containerId: 'upload-video' });
        }).catch(error => {
            setLoading(false);
            handleSetWaiting(false);
            setIsUpload(false);
            toast.error('Upload file thất bại', { containerId: 'upload-video' });
        }).finally(() => { setLoading(false); });

    };


    const deleteVideo = (e: any) => {
        e.preventDefault();
        setLoading(true);
        deleteDocument(documentResponse.id)
            .then(response => {
                if (response.status !== 200) {
                    toast.error(response.message, { containerId: 'upload-video' });
                    setLoading(false);
                    return;
                }
                // setDocumentIds(documentIds.filter(id => id !== documentResponse.id));
                handleDeleteDocumentIds(documentResponse.id);
                setDocumentResponse({ id: 0, url: '' });
                clearFile();
                toast.success(response.message, { containerId: 'upload-video' });
                setLoading(false);
            })
    }

    const clearFile = () => {
        if (inputRef.current) {
            inputRef.current.value = ''; // Xóa giá trị của input
        }
        setFile(null); // Reset state file
    }
    return (
        <div className="upload-container mt-5">
            <Loading loading={loading} />
            <ToastContainer containerId='upload-video' />
            <label className="mb-4 text-center">{label}<i className="mr-2 fa-solid fa-cloud-arrow-up"></i></label>
            <div className="upload-file-area">
                {!documentResponse.url && !isUpload && <input accept="video/*" ref={inputRef} type="file" onChange={handleFileChange} />}
                {!file && documentResponse.url && <button className="btn btn-danger btn-delete-video" onClick={deleteVideo}>Xóa video</button>}
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {loading && <div className="loader"></div>}
            {documentResponse.url && <video id="video-preview-upload" className="mt-2 col-12 col-md-12" src={documentResponse.url} controls></video>}
        </div>
    );
};
