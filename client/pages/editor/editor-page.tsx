import "./editor.css"
import { CodeEditor } from "./components/Editor"
import { useContext, useEffect, useState } from "react"
import { SelectedProjectContext } from "../../App"
import { NetworkManager } from "../../Network/manager"
import { ProjectInterface } from "../../Constants"
import { FileButton } from "./components/fileButton"

export function EditorPage() {
    const [fileList, setFileList] = useState<string[]>([])

    const devProject: ProjectInterface = {
            "id": "0",
            "name": "Project",
            "description": "1234",
            "author": "OmerChen10"
    }
    const nm = NetworkManager.getInstance()

    useEffect(() => {
        nm.addInitCallback(() => {
            nm.send("setCurrentProject", devProject)
            fetchFiles()
        })
    }, [])

    function fetchFiles() {
        nm.send("getProjectFilePaths", { id: devProject["id"] }, (response) => {
            if (response.success) {
                setFileList(response.data)
            }
        })
    }

    function renderFileList() {
        return fileList.map((file) => {
            return <FileButton fileName={file.split("\\").pop() as string} key={file}/>
        })
    }
    return (
        <div id="main-editor">
            <div id="navbar">
                <h2 id="navbar-title">CodeJam</h2>
                <h2 id="project-name">New Project <span className="badge text-bg-secondary">Saved</span></h2>
            </div>
            <div id="editor-container">
                <div id="editor-nav">
                    <h3 id="file-list-title">Files</h3>
                    <div id="file-list">
                        {renderFileList()}
                    </div>
                </div>
                <CodeEditor />
            </div>
        </div>
    )
}