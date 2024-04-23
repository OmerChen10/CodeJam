import { NetworkManager } from "../../../Network/manager";
import { EditorConfig } from "../../../Constants";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";
import { SelectedProjectContext } from "../../../App";
import { LoadingContext } from "../editor-page";
import { Terminal } from "./Terminal";
import { SelectedFileNameContext } from "../editor-page";


interface props {
    fileSaved: (state: boolean) => void
}

export function CodeEditor({fileSaved}: props) {

    const [selectedProject, _] = useContext(SelectedProjectContext)
    const currFileName = useContext(SelectedFileNameContext)
    const setLoading = useContext(LoadingContext)

    const nm = useRef<NetworkManager>(NetworkManager.getInstance()).current
    const editorRef = useRef<editor.IStandaloneCodeEditor>()
    const isProgrammaticChange = useRef<boolean>(false)
    const prevFileName = useRef<string>("")
    const fileChangeTimestamp = useRef<number>(0)

    const [editorText, updateEditorText] = useState<string>("")


    useEffect(() => {
        if (currFileName === "") return
        if (currFileName === prevFileName.current) return
        if (editorRef.current) saveFile()

        prevFileName.current = currFileName
        setLoading(true)
        fetch(EditorConfig.STORAGE_DIRECTORY + selectedProject.id + "//" + currFileName).then((response) => {
            setLoading(false)
            fileSaved(true)
            response.text().then((text) => {
                updateEditorText(text)
            })
        })
    }, [currFileName])

    const handleChanges = () => {
        fileChangeTimestamp.current = Date.now()
        fileSaved(false)
        autoSave()
    }

    const autoSave = () => {
        setTimeout(() => {
            if (Date.now() - fileChangeTimestamp.current > EditorConfig.AUTO_SAVE_TIME) {
                saveFile()
            }
        }, EditorConfig.AUTO_SAVE_TIME)
    }

    const saveFile = () => {
        nm.send("autoSave", {
            name: prevFileName.current,
            data: editorRef.current?.getValue()
        })
        fileSaved(true)
    }

    const renderEditor = () => {
        if (currFileName == "") {
            return <h1 id="select-file-text">Select a file to edit</h1>
        }
        else return (
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
                onChange={handleChanges}
                onMount={(ref) => {editorRef.current = ref}}
                value={editorText}
                />
        )
    }


    nm.onEvent("editorReceive", (changes: object) => {
        if (editorRef.current === undefined) {
            return
        }
        isProgrammaticChange.current = true
        editorRef.current.executeEdits("Server", (changes as any)["data"])
    })

    return ((
        <div id="code-editor">
            <div id="editor-wrapper">
                {renderEditor()}
            </div>
            <Terminal/>
        </div>
    )
    )
}