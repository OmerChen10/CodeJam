import { useNetwork, ShareDBManager, useProject } from "../../../utils";
import { EditorConfig } from "../../../config/constants";
import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
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
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
    const fileChangeTimestamp = useRef<number>(0)
    const otController = ShareDBManager.getInstance()
    const projectProvider = useProject()

    useEffect(() => {
        const editor = monaco.editor.create(document.getElementById("editor-wrapper")!, {
            theme: "vs-dark"
        })
        updateBinding(editor)
    }, [])

    useEffect(() => {
        // Update on file change
        if (currFileName === "") return
        if (currFileName === prevFileName) return
        updateBinding(editor!)
        
    }, [currFileName, editor])

    function updateBinding(editor: monaco.editor.IStandaloneCodeEditor) {
        setEditor(editor)
        editor.setModel(monaco.editor.createModel("", getLanguage(), monaco.Uri.parse(currFileName)))
        otController.mount(editor, projectProvider.currentProject.id)
    }

    function getLanguage() {
        const ext = currFileName.split(".")[1]
        return EditorConfig.supportedLanguages[ext] || ""
    }

    return ((
        <div id="code-editor">
            <div id="editor-wrapper"/>
            <Terminal/>
        </div>
    )
    )
}