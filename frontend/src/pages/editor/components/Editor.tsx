import { useNetwork } from "../../../utils";
import { EditorConfig } from "../../../config/constants";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";
import { LoadingContext } from "../editor-page";
import { Terminal } from "./Terminal";
import React from "react";

interface props {
    fileSaved: (state: boolean) => void
    currFileName: string
    prevFileName: string
}

export function CodeEditor({fileSaved, currFileName, prevFileName}: props) {

    const setLoading = useContext(LoadingContext)
    const nm = useNetwork()
    const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>()
    const fileChangeTimestamp = useRef<number>(0)


    useEffect(() => {
        if (currFileName === "") return
        if (currFileName === prevFileName) return
        saveFile(prevFileName)
        fetchFile(currFileName)
    }, [currFileName, editor])


    function handleChanges() {
        fileChangeTimestamp.current = Date.now()
        fileSaved(false)
        autoSave()
    }

    function fetchFile(fileName: string) {
        setLoading(true)
        nm.send("fetchFile", {name: fileName}).then((response) => {
            if (response.success) {
                setLoading(false)
                fileSaved(true)
                editor?.setValue(response.data)
            }
        })
    }

    function autoSave() {
        setTimeout(() => {
            if (Date.now() - fileChangeTimestamp.current > EditorConfig.AUTO_SAVE_TIME) {
                saveFile(currFileName)
            }
        }, EditorConfig.AUTO_SAVE_TIME)
    }

    function saveFile(fileName: string) {
        if (fileName === "") return
        nm.send("autoSave", {
            name: fileName,
            data: editor?.getValue()
        })
        fileSaved(true)
    }

    function renderEditor() {
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
                onMount={(ref) => {setEditor(ref)}}
                />
        )
    }

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