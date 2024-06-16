
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
export default function MyEditor({ data, onChange }: { data: string, onChange: (event: any) => void }) {
    // const MyCustomUploadAdapterPlugin: any = (editor: any) => {
    //     editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    //         return null;
    //     };
    // }
    // Editor.builtinPlugins.push( );

    return <CKEditor
        editor={Editor}
        data={data}
        config={{
            placeholder: 'Nhập nội dung',
            toolbar: {
                items: [
                    'heading',
                    'imageUpload',
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
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    '|',
                    'undo',
                    'redo',
                    'code',
                    'codeBlock'
                ]
            },
            ckfinder: {
                uploadUrl: 'http://localhost:8080/api/v1/upload/9'
            },

        }
        }
        onChange={(event, editor) => {
            const data = editor.getData();
            if (onChange) {
                onChange(data);
            }
        }}
    />
}