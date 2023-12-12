import { NetworkManager } from "../Network/manager";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef } from "react";


export function CodeEditor() {

    const nm = useRef<NetworkManager>(NetworkManager.getInstance()).current
    const editorRef = useRef<editor.IStandaloneCodeEditor>()
    const isProgrammaticChange = useRef<boolean>(false)

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
        console.log(event.changes)
        nm.send("editorSend", event.changes)
    }

    nm.onEvent("editorReceive", (changes: editor.IModelContentChange[]) => {
        if (editorRef.current === undefined) {
            return
        }
        isProgrammaticChange.current = true
        editorRef.current.executeEdits("Server", changes)
    })

    return (
        <Editor
            height="90vh"
            defaultLanguage="python"
            theme="vs-dark"
            options={{
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
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
        onValidate={(markers) => {
            console.log(markers)

        }}
        />
    )
}