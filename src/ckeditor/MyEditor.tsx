import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { getToken } from '../api/AuthenticationApi';
const baseViewUrl = 'http://localhost:8080/api/v1/documents/view/';
class MyUploadAdapter {
    loader: any;
    controller: AbortController;

    constructor(loader: any) {
        this.loader = loader;
        this.controller = new AbortController();
    }

    // Starts the upload process.
    async upload() {
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
            console.log("url", baseViewUrl + result.data.id)
            return {
                default: baseViewUrl + result.data.id
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
        return new MyUploadAdapter(loader);
    };
}

export default function MyEditor({ data, onChange }: { data: string, onChange: (event: any) => void }) {

    return (
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
    );
}