import { Editor } from "@monaco-editor/react";
import { useRef } from "react";
import { NetworkManager } from "../Network/manager";
import { editor } from "monaco-editor";


export function CodeEditor() {

    const nm = useRef<NetworkManager>(NetworkManager.getInstance()).current
    
    const SendChanges = (value: string | undefined, event: editor.IModelContentChangedEvent) => {
        console.log(value)
        nm.send("editorSend", event.changes)
    }

    nm.onEvent("editorReceive", (changes: editor.IModelContentChange[]) => {
        console.log(changes)
    })
    
    return (
        <Editor
            height="90vh"
            defaultLanguage="python"
            defaultValue="// Enter your code"
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
        />
    )
}