import { NetworkManager } from "../Network/manager";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef } from "react";
import { EditorConfig } from "../Constants";

export function CodeEditor() {

    const nm = useRef<NetworkManager>(NetworkManager.getInstance()).current
    const editorRef = useRef<editor.IStandaloneCodeEditor>()
    const isProgrammaticChange = useRef<boolean>(false)

    const duringCooldown = useRef<boolean>(false)
    const changeBuffer = useRef<editor.IModelContentChange[]>([])

    const SetEditor = (ref: editor.IStandaloneCodeEditor) => {
        editorRef.current = ref
    }

    const SendChanges = (value: string | undefined, event: editor.IModelContentChangedEvent) => {
        if (value === undefined) {
            return
        }
        if (isProgrammaticChange.current) {
            isProgrammaticChange.current = false
            return
        }
        
        changeBuffer.current.push(...event.changes) 
        if (!duringCooldown.current) {
            duringCooldown.current = true
            setTimeout(() => {
                duringCooldown.current = false
                nm.send("editorSend", changeBuffer.current) 
                changeBuffer.current = []
            }, EditorConfig.COOLDOWN_TIME)
        }
    }

    nm.onEvent("editorReceive", (changes: object) => {
        if (editorRef.current === undefined) {
            return
        }
        isProgrammaticChange.current = true
        editorRef.current.executeEdits("Server", (changes as any)["data"])
    })

    return ((
        <div id="editor-wrapper">
            <Editor
                defaultLanguage="python"
                theme="vs-dark"
                options={{
                    autoClosingBrackets: "never",
                    autoClosingQuotes: "never",
                    autoIndent: "full",
                    automaticLayout: true,
                    colorDecorators: true,
                    contextmenu: true,
                    cursorBlinking: "blink",
                    cursorSmoothCaretAnimation: 'on',
                    cursorStyle: "line"
                }}
                onChange={SendChanges}
                onMount={SetEditor}
                />
        </div>
    )
    )
}