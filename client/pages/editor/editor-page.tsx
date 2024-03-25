import "./editor.css"
import { CodeEditor } from "./components/Editor"
import { useContext, useEffect, useState } from "react"
import { SelectedProjectContext } from "../../App"
import { NetworkManager } from "../../Network/manager"
import { ProjectInterface } from "../../Constants"
import { FileButton } from "./components/fileButton"

export function EditorPage() {
    const [fileList, setFileList] = useState<string[]>([])
    const [selectedProject, setSelectedProject] = useContext(SelectedProjectContext)

    const nm = NetworkManager.getInstance()

    useEffect(() => {
        console.log("Getting project file paths")
        nm.send("getProjectFilePaths", {}, (response) => {
            if (response.success) {
                setFileList(response.data)
            }
        })
    }, [selectedProject])

    function renderFileList() {
        return fileList.map((file) => {
            return <FileButton filePath={file} key={file}/>
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