import {useRef} from 'react';
import {Editor, type IAllProps} from '@tinymce/tinymce-react';
import {env} from "@/env";

export function RichTextEditor(props:IAllProps) {
    const editorRef = useRef(null);


    return (
        <>
            <Editor
                apiKey={env.VITE_TINYMCE_API_KEY}
                onInit={(_evt, editor) => editorRef.current = editor}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                {...props}
            />
        </>
    );
}