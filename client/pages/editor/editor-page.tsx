import "./editor.css"
import { CodeEditor } from "./components/Editor"
import { useContext, useEffect, useState } from "react"
import { SelectedProjectContext } from "../../App"
import { NetworkManager } from "../../Network/manager"
import { FileButton } from "./components/fileButton"
import { toast } from "sonner"

export function EditorPage() {
    const [fileList, setFileList] = useState<string[]>([])
    const [selectedProject] = useContext(SelectedProjectContext)
    const [selectedFile, setSelectedFile] = useState<string>("")

    const nm = NetworkManager.getInstance()

    useEffect(() => {
        nm.send("getProjectFilePaths", {}, (response) => {
            if (response.success) {
                setFileList(response.data)
            }
        })
    }, [])

    function renderFileList() {
        return fileList.map((fileName) => {
            return <FileButton fileName={fileName} key={fileName} 
                onOpen={() => setSelectedFile(fileName)}
                onRename={
                    (oldName: string, newName: string) => {
                        setFileList(fileList.map((name) => {
                            if (name === oldName) {
                                return newName
                            }
                            return name
                        }))
                    }
                }
                onDelete={() => {}}/>
        })
    }

    function createNewFile() {
        nm.send("createFile", {name: "New File"}, (response) => {
            if (response.success) {
                toast.success("File created successfully!")
                setFileList([...fileList, response.data])
            }
            else {
                toast.error("Failed to create file!")
            }
        })
    }

    return (
        <div id="main-editor">
            <div id="navbar">
                <h2 id="navbar-title">CodeJam</h2>
                <h2 id="project-name">{selectedProject.name} <span className="badge text-bg-secondary">Saved</span></h2>
            </div>
            <div id="editor-container">
                <div id="editor-nav">
                    <div id="file-list-title">
                        <h3>Files:</h3>
                        <img src="./client/assets/images/new-file-icon.png" id="create-file-icon" onClick={createNewFile} />
                    </div>
                    <div id="file-list">
                        {renderFileList()}
                    </div>
                </div>
                <CodeEditor filePath={selectedFile}/>
            </div>
        </div>
    )
}