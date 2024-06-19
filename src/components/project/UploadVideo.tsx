import React, { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { getToken } from "../../api/AuthenticationApi";
import '../css/uploadfile.css';
import { DocumentResponse } from "../../model/DocumentResponse";
import { deleteDocument } from "../../api/documentAPI/DocumentAPI";
import { getEmailFromToken } from "../../api/CommonApi";
interface UploadVideoProps {
    label: string;
    documentIds: number[];
    setDocumentIds: (documentIds: number[]) => void;
}
export const UploadVideo: React.FC<UploadVideoProps> = ({ documentIds, setDocumentIds, label }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [stompClient, setStompClient] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [documentResponse, setDocumentResponse] = useState<DocumentResponse>({
        id: 0,
        url: ''
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        if (event.target.files) {
            setFile(event.target.files[0]);
            const videoTypes = ["video/mp4", "video/avi", "video/mkv", "video/mov"];
            if (!videoTypes.includes(event.target.files[0]?.type)) {
                setError("Chỉ chấp nhận file video có định dạng mp4, avi, mkv, mov");
                return;
            }
        }
    };
    useEffect(() => {
        if (!file) setError('');
    }, [file]);
    useEffect(() => {
        if (isConnected || stompClient) {
            // alert("Đã kết nối với server");
            return;
        };
        const socket = new SockJS('http://localhost:8080/ws');
        const client = over(socket);
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };

        client.connect(headers, () => {
            setIsConnected(true);
            setStompClient(client);
            console.log("Đã kết nối với server!!!!!!!!!!!");
            client.subscribe('/topic/upload-progress/' + getEmailFromToken(), (message) => {
                const receivedProgress = parseInt(message.body);
                setProgress(receivedProgress);
            });
        }, (error) => {
            // Xử lý lỗi kết nối tại đây
            console.error('không thể kết nối tới websocket:', error);
            setIsConnected(false);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                    setIsConnected(false);
                    alert("Ngắt kết nối với server");
                });
            }
        };
    }, [stompClient, isConnected]);
    const upload = async () => {
        if (!file) return;
        setIsUpload(true);
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('http://localhost:8080/api/v1/documents/upload-progress', {
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
                setDocumentResponse({ id: 0, url: '' });
                return;
            }
            setDocumentIds([...documentIds, result.data.id]);
            setFile(null);
            setIsUpload(false);
            setDocumentResponse(result.data);
            setLoading(false);

            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file', error);
            setLoading(false);
        }
    };

    const deleteVideo = () => {
        setLoading(true);
        deleteDocument(documentResponse.id)
            .then(response => {
                if (response.status !== 200) {
                    alert(response.message);
                    setLoading(false);
                    return;
                }
                setDocumentIds(documentIds.filter(id => id !== documentResponse.id));
                setDocumentResponse({ id: 0, url: '' });
                clearFile();
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    }

    const clearFile = () => {
        if (inputRef.current) {
            inputRef.current.value = ''; // Xóa giá trị của input
        }
        setFile(null); // Reset state file
    }
    return (
        <div className="upload-container mt-5">
            <label className="mb-4 text-center">{label}<i className="mr-2 fa-solid fa-cloud-arrow-up"></i></label>
            <div className="upload-file-area">
                {!documentResponse.url && !isUpload && <input accept="video/*" ref={inputRef} type="file" onChange={handleFileChange} />}
                {file && !isUpload && !error && <button className="btn btn-secondary btn-upload-video" onClick={upload}>Upload</button>}
                {!file && documentResponse.url && <button className="btn btn-danger btn-delete-video" onClick={deleteVideo}>Xóa video</button>}
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {loading && <div className="loader"></div>}
            {isUpload && <div className="progress mt-4">
                <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
                    {progress}%
                </div>
            </div>}
            {documentResponse.url && <video id="video-preview-upload" className="mt-2 col-12 col-md-12" src={documentResponse.url} controls></video>}
        </div>
    );
};
