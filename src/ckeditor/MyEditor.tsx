import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { getToken } from '../api/AuthenticationApi';
import React, { useEffect, useState } from 'react';
import { requestWithPostFile } from '../api/CommonApi';
const baseViewUrl = 'http://localhost:8080/api/v1/documents/view/';
interface MyEditorProps {
    data: string;
    onChange: (event: any) => void;
    uploadImage: boolean;
    handleSetDocumentIds(id: number): void;
}
const MyEditor: React.FC<MyEditorProps> = ({ data, onChange, uploadImage, handleSetDocumentIds }) => {
    ;

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
                const response = await requestWithPostFile('http://localhost:8080/api/v1/documents/upload', formData);
                if (response.status !== 201) {
                    alert("Upload failed");
                }
                handleSetDocumentIds(response.data.id);
                return {
                    default: baseViewUrl + response.data.id,
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
