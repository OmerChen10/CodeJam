import monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';

function Editor() {
    const editorRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (editorRef.current) {
        const editor = monaco.editor.create(editorRef.current, {
            value: '// some comment',
            language: 'javascript',
        });
        }
    }, []);
    
    return <div ref={editorRef} />;
}

export default Editor;