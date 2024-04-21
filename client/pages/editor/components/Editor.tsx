import { NetworkManager } from "../../../Network/manager";
import { EditorConfig } from "../../../Constants";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";
import { SelectedProjectContext } from "../../../App";
import { LoadingContext } from "../editor-page";
import { Terminal } from "./Terminal";

interface props {
    filePath: string
    fileSaved: (state: boolean) => void
}

export function CodeEditor({filePath, fileSaved}: props) {

    const [selectedProject, _] = useContext(SelectedProjectContext)
    const nm = useRef<NetworkManager>(NetworkManager.getInstance()).current
    const editorRef = useRef<editor.IStandaloneCodeEditor>()
    const isProgrammaticChange = useRef<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<string>("")
    const currFileName = useRef<string>("")

    const duringCooldown = useRef<boolean>(false)
    const fileChangeTimestamp = useRef<number>(0)
    const changeBuffer = useRef<editor.IModelContentChange[]>([])
    const setLoading = useContext(LoadingContext)

    useEffect(() => {
        if (filePath === "") return
        if (currFileName.current === filePath) return
        if (editorRef.current) saveFile()

        currFileName.current = filePath
        setLoading(true)
        fetch(EditorConfig.STORAGE_DIRECTORY + selectedProject.id + "//" + filePath).then((response) => {
            setLoading(false)
            response.text().then((text) => {
                setSelectedFile(text)
            })
        })
    }, [filePath])

    const handleChanges = (value: string | undefined, event: editor.IModelContentChangedEvent) => {
        fileChangeTimestamp.current = Date.now()
        fileSaved(false)
        SendChanges(value, event)
        autoSave()
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
        // if (!duringCooldown.current) {
        //     duringCooldown.current = true
        //     setTimeout(() => {
        //         duringCooldown.current = false
        //         nm.send("editorSend", changeBuffer.current) 
        //         changeBuffer.current = []
        //     }, EditorConfig.COOLDOWN_TIME)
        // }
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
            name: currFileName.current,
            data: editorRef.current?.getValue()
        })
        fileSaved(true)
    }

    const renderEditor = () => {
        if (filePath == "") {
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
                value={selectedFile}
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