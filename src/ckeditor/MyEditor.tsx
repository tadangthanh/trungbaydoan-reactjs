import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { getToken } from '../api/AuthenticationApi';
import React from 'react';
const baseViewUrl = 'http://localhost:8080/api/v1/documents/view/';
interface MyEditorProps {
    data: string;
    onChange: (event: any) => void;
    uploadImage: boolean;
    documentIds: number[];
    setDocumentIds: (documentIds: number[]) => void;

}
const MyEditor: React.FC<MyEditorProps> = ({ data, onChange, uploadImage, documentIds, setDocumentIds }) => {
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
                const response = await fetch('http://localhost:8080/api/v1/documents/upload', {
                    method: 'POST',
                    body: formData,
                    signal: this.controller.signal,
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log("id", result.data.id)
                setDocumentIds([...documentIds, result.data.id]);
                return {
                    default: baseViewUrl + result.data.id,
                    width: '500',
                    height: '500px'
                };
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Upload aborted');
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
        <div id='project-editor-content'>
            <CKEditor
                editor={Editor}
                data={data}
                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    placeholder: 'Nhập nội dung',
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
                    if (onChange) {
                        onChange(data);
                    }
                }}
            />
        </div>
    );
}
export default MyEditor;
