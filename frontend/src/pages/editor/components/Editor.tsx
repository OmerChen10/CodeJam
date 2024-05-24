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
}

export function CodeEditor({fileSaved, currFileName}: props) {

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
        setEditor(editor)
    }, [])

    useEffect(() => {
        // Update on file change
        updateBinding()
        
    }, [currFileName])

    function updateBinding() {
        if (currFileName === "") return
        
        let uri = monaco.Uri.file(currFileName + "cj")
        let model = monaco.editor.getModel(uri)
        if (!model) {
           model = monaco.editor.createModel("", getLanguage()!, uri)
           editor!.setModel(model)
           otController.initialize_model(editor!, projectProvider.currentProject.id)
        } 

        editor!.setModel(model)
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