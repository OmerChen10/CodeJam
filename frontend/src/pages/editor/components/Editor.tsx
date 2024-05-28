import { useNetwork, ShareDBManager, useProject } from "../../../utils";
import { EditorConfig } from "../../../config/constants";
import * as monaco from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";
import { LoadingContext } from "../editor-page";
import { Terminal } from "./Terminal";
import React from "react";

interface props {
    fileSaved: (state: boolean) => void
    currFileName: string
}

export function CodeEditor({ fileSaved, currFileName }: props) {

    const setLoading = useContext(LoadingContext)
    const nm = useNetwork()
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
    const fileChangeTimestamp = useRef<number>(0)
    const otController = ShareDBManager.getInstance()
    const projectProvider = useProject()
    const timeout = useRef<NodeJS.Timeout>()
    const currFileNameRef = useRef<string>(currFileName)

    useEffect(() => {
        const editor = monaco.editor.create(document.getElementById("editor-wrapper")!, {
            theme: "vs-dark"
        })

        // Setup automatic file saves
        editor.onDidChangeModelContent(() => {
            if (currFileNameRef.current === "") return
            fileChangeTimestamp.current = Date.now()
            fileSaved(false)
            if (timeout.current) clearTimeout(timeout.current)
            timeout.current = setTimeout(() => {
                if (Date.now() - fileChangeTimestamp.current > EditorConfig.AUTO_SAVE_TIME) {
                    nm.send("saveFile", { name: currFileNameRef.current})
                    fileSaved(true)
                }
            }, EditorConfig.AUTO_SAVE_TIME)
        })
        setEditor(editor)
    }, [])

    useEffect(() => {
        // Update on file change
        currFileNameRef.current = currFileName
        updateBinding()

    }, [currFileName])

    function updateBinding() {
        if (currFileNameRef.current === "") return

        let uri = monaco.Uri.file(currFileNameRef.current)
        let model = monaco.editor.getModel(uri)
        if (!model) {
            model = monaco.editor.createModel("", getLanguage()!, uri)
            editor!.setModel(model)
            otController.initialize_model(editor!, projectProvider.currentProject.id)
        }

        editor!.setModel(model)
    }

    function getLanguage() {
        const ext = currFileNameRef.current.split(".")[1]
        return EditorConfig.monacoSupportedLanguages[ext] || ""
    }

    return ((
        <div id="code-editor">
            <div id="editor-wrapper" />
            <Terminal />
        </div>
    )
    )
}