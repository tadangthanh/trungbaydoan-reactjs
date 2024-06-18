import React, { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { getToken } from "../../api/AuthenticationApi";
import '../css/uploadfile.css';
import { DocumentResponse } from "../../model/DocumentResponse";
import { deleteDocument } from "../../api/documentAPI/DocumentAPI";
import { getEmailFromToken } from "../../api/CommonApi";
interface UploadFileProps {
    documentIds: number[];
    setDocumentIds: (documentIds: number[]) => void;
}
export const UploadFile: React.FC<UploadFileProps> = ({ documentIds, setDocumentIds }) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [stompClient, setStompClient] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null); // Tạo tham chiếu
    const [documentResponse, setDocumentResponse] = useState<DocumentResponse>({
        id: 0,
        url: ''
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
            const btnUpload = document.querySelector('.btn-upload-video') as HTMLElement;
            btnUpload.style.display = 'block';
        }
        hideVideo();
        setProgress(0);
    };

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
            setIsUpload(false);
            setDocumentResponse(result.data);
            setLoading(false);

            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!isUpload) return;
        const fileInput = document.querySelector('#file') as HTMLElement;
        fileInput.style.display = 'none';
        const btnUpload = document.querySelector('.btn-upload-video') as HTMLElement;
        btnUpload.style.display = 'none';

    }, [isUpload]);
    useEffect(() => {
        if (documentResponse.url === '') return;
        const video = document.getElementById('video-preview-upload') as HTMLVideoElement;
        const progressBar = document.querySelector('#progress-upload-video') as HTMLElement;
        const btnUpload = document.querySelector('.btn-upload-video') as HTMLElement;
        const btnDelete = document.querySelector('.btn-delete-video') as HTMLElement;
        btnDelete.style.display = 'block';
        btnUpload.style.display = 'none';
        progressBar.style.display = 'none';
        video.src = documentResponse.url;
        video.style.display = 'block';
        const fileInput = document.querySelector('#file') as HTMLElement;
        fileInput.style.display = 'none';
    }, [documentResponse.url]);
    useEffect(() => {
        if (progress === 0) {
            const btnDelete = document.querySelector('.btn-delete-video') as HTMLElement;
            btnDelete.style.display = 'none';
            const fileInput = document.querySelector('#file') as HTMLElement;
            fileInput.style.display = 'block';
        } else {
            const progressBar = document.querySelector('#progress-upload-video') as HTMLElement;
            progressBar.style.display = 'block';
        }
    }, [progress]);
    const hideVideo = () => {
        const video = document.getElementById('video-preview-upload') as HTMLVideoElement;
        video.style.display = 'none';
        video.src = '';
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
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
        hideVideo();
        setDocumentResponse({ id: 0, url: '' })
        setProgress(0);
        clearFile();

    }
    const clearFile = () => {
        if (inputRef.current) {
            inputRef.current.value = ''; // Xóa giá trị của input
        }
        setFile(null); // Reset state file
    }
    return (
        <div className="upload-container mt-5 col-12 col-md-4">
            <h2 className="mb-4 text-center">Upload video<i className="mr-2 fa-solid fa-cloud-arrow-up"></i></h2>
            <div className="upload-file-area">
                <input id="file" ref={inputRef} type="file" onChange={handleFileChange} />
                <button className="btn btn-success btn-upload-video " onClick={upload}>Upload</button>
                <button className="btn btn-danger btn-delete-video" onClick={deleteVideo}>Xóa video</button>
            </div>

            {loading && <div className="loader"></div>}
            <div className="progress mt-4" id="progress-upload-video">
                <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
                    {progress}%
                </div>
            </div>
            <video id="video-preview-upload" className="mt-2 col-12 col-md-12" src="" controls></video>
        </div>
    );
};
