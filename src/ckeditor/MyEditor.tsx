import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useRef, useState } from 'react';
import { apiUrl, requestWithPostFile } from '../api/CommonApi';
import '../../src/components/css/MyEditor.css';
import { toast, ToastContainer } from 'react-toastify';
interface MyEditorProps {
    data: string;
    onChange: (event: any) => void;
    uploadImage: boolean;
    handleSetDocumentIds(id: number): void;
    mapIdUrl?: Map<string, number>;
    setContainError?: (error: boolean) => void;
    maxContentLength?: number;
    setMapIdUrl?: React.Dispatch<React.SetStateAction<Map<string, number>>>;
}
const MyEditor: React.FC<MyEditorProps> = ({ mapIdUrl, setContainError, setMapIdUrl, data, maxContentLength, onChange, uploadImage, handleSetDocumentIds }) => {
    const replaceIframeWithOembed = (data: string) => {
        const doc = new DOMParser().parseFromString(data, 'text/html');
        const iframes = doc.querySelectorAll('iframe');
        iframes.forEach((element) => {
            const src = element?.getAttribute('src');
            const url = src?.replace('embed/', 'watch?v=').split('&')[0];
            //create oembed
            const oembed = doc.createElement('oembed');
            oembed.setAttribute('url', url || '');
            element.replaceWith(oembed);
        })

        return doc.body.innerHTML;
    }
    const [dataTemp, setDataTemp] = useState<string>(replaceIframeWithOembed(data));
    const containerEditor = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const images = document.querySelectorAll('img:not(.img-profile)') as NodeListOf<HTMLElement>;
        const ckEdit = document.querySelectorAll('.ck-content') as NodeListOf<HTMLElement>;
        ckEdit.forEach((element) => {
            element.addEventListener('focus', () => {
                document.getElementById("header")?.classList.add('d-none');
            })
            element.addEventListener('blur', () => {
                document.getElementById("header")?.classList.remove('d-none');
            })
        })
        images.forEach((element, index) => {
            element.style.display = 'flex';
            element.style.width = '50%';
        })
    }, [dataTemp]);

    const [error, setError] = useState<string>('');
    const onChangeDataTemp = (dataTemp: string) => {
        if (maxContentLength && dataTemp.length > maxContentLength) {
            setError(`Nội dung không được vượt quá ${maxContentLength} ký tự`);
            setContainError && setContainError(true);
            return;
        } else {
            const element = document.getElementsByClassName("ck-editor__main")[0] as HTMLElement;
            element.style.border = "";
            setContainError && setContainError(false);
            setError('');
        }
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeName === 'FIGURE') {
                            const figureElement = node as HTMLElement;
                            const imgElement = figureElement.querySelector('img');
                            if (imgElement) {
                                handleImageDeletion(node);
                            }
                        }
                    });
                }
            }
        });
        const contentEdit = document.querySelectorAll('.ck-editor__main');
        contentEdit.forEach((element) => {
            if (element) {
                observer.observe(element, { childList: true, subtree: true });
            }
        });
        function handleImageDeletion(node: any) {
            const url = node.getElementsByTagName('img')[0]?.src;
            const id = getIdFromUrl(url) as number;
            if (!mapIdUrl?.has(url) && setMapIdUrl) {
                setMapIdUrl(new Map(mapIdUrl?.set(url, id)));
            }
        }
        setDataTemp(dataTemp);
        onChange(replaceOembedWithIframe(dataTemp));
    }

    const replaceOembedWithIframe = (data: string) => {
        const doc = new DOMParser().parseFromString(data, 'text/html');
        const oembeds = doc.querySelectorAll('oembed[url]');
        oembeds.forEach((element) => {
            const src = element?.getAttribute('url');
            const url = src?.replace('watch?v=', 'embed/').split('&')[0];
            //create iframe
            const iframe = document.createElement('iframe');
            iframe.src = url || '';
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.left = '0';
            iframe.style.top = '0';
            iframe.style.position = 'absolute';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', '');
            //create ckmedia
            const ckMedia = doc.createElement('div');
            ckMedia.className = 'ck-media__wrapper';
            // create
            const ckMediaBody = doc.createElement('div');
            ckMediaBody.style.position = 'relative';
            ckMediaBody.style.paddingBottom = '56.25%';
            ckMediaBody.style.height = '0';
            ckMediaBody.appendChild(iframe);
            ckMedia.appendChild(ckMediaBody);
            element.replaceWith(ckMedia);
        })
        return doc.body.innerHTML;
    }
    // useEffect(() => {

    // }, [dataTemp]);

    const getIdFromUrl = (url: string) => {
        if (mapIdUrl?.has(url)) {
            return mapIdUrl.get(url);
        }
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
    }
    class MyUploadAdapter {
        loader: any;
        controller: AbortController;

        constructor(loader: any) {
            this.loader = loader;
            this.controller = new AbortController();
        }

        // Starts the upload process.
        async upload() {
            if (this.loader == null) {
                return Promise.reject('Không cho phép upload ở đây');
            }
            const file = await this.loader.file;
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await requestWithPostFile(`${apiUrl}/documents/upload`, formData);
                if (response.status !== 201) {
                    toast.error(response.message, { containerId: 'my-editor' });
                } else {
                    // toast.success(response.message)
                }
                handleSetDocumentIds(response.data.id);
                return {
                    default: apiUrl + "/documents/view/" + response.data.id,
                    width: '500',
                    height: '500px'
                };
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    toast.error("Upload bị hủy", { containerId: 'my-editor' });
                } else {
                    console.error('Error during file upload', error);
                    throw error;
                }
            }
        }

        abort() {
            console.log("abort");
            this.controller.abort();
        }
    }

    function MyCustomUploadAdapterPlugin(editor: any) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
            if (uploadImage) {
                return new MyUploadAdapter(loader);
            }
            return new MyUploadAdapter(null);
        };
    }
    return (
        <div id='project-editor-content' ref={containerEditor}>
            <ToastContainer containerId='my-editor' />
            <CKEditor
                editor={Editor}
                data={dataTemp}
                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    placeholder: 'Nhập nội dung ở đây...',
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'underline',
                            '|',
                            'numberedList',
                            'bulletedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'link',
                            'imageUpload',
                            'blockQuote',
                            'insertTable',
                            'mediaEmbed',
                            '|',
                            'undo',
                            'redo',
                            'code',
                            'codeBlock'
                        ]
                    }

                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChangeDataTemp(data)
                }}
            />
            <span className='text-danger'>{error}</span>
        </div>
    );
}
export default MyEditor;
