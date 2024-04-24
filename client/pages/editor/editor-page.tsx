import "./editor.css"
import { CodeEditor } from "./components/Editor"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { SelectedProjectContext } from "../../App"
import { NetworkManager } from "../../Network/manager"
import { FileButton } from "./components/fileButton"
import { toast } from "sonner"
import { EditorConfig } from "../../Constants"
import { ImageButton } from "../../components/ImageButton/ImageButton"
import { Avatar } from "@mui/material"

export const LoadingContext = createContext<(loading: boolean) => void>(() => {})
export const SelectedFileNameContext = createContext<string>("")

export function EditorPage() {
    const [fileList, setFileList] = useState<string[]>([])
    const [selectedProject] = useContext(SelectedProjectContext)
    const [selectedFile, setSelectedFile] = useState<string>("")
    const [isLoading, setLoading] = useState<boolean>(false)
    const [fileSaved, setFileSaved] = useState<boolean>(true)

    const nm = NetworkManager.getInstance()
    const runEnabled = useRef(false)

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
                onOpen={() => {
                    setSelectedFile(fileName)
                    if (fileName.split(".")[1] in EditorConfig.supportedLanguages) {
                        runEnabled.current = true
                    }
                    else {
                        runEnabled.current = false
                    }
                }}
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
                onDelete={() => {
                    setFileList(fileList.filter((name) => name !== fileName))
                    nm.send("deleteFile", {name: fileName}, (response) => {
                        if (response.success) {
                            toast.success("File deleted successfully!")
                            setSelectedFile("")
                        }
                        else {
                            toast.error("Failed to delete file!")
                        }
                    })
                }}/>
        })
    }

    function renderSaveIndicator() {
        if (fileSaved) {
            return <img src="./client/assets/images/checkmark-icon.png"/>
        }
        return <div id="save-spinner" className="spinner-border" role="status"/>
    }

    function createNewFile() {
        nm.send("createFile", {name: "New File"}, (response) => {
            if (response.success) {
                toast.success("File created successfully!")
                setFileList([...fileList, "New File"])
            }
            else {
                toast.error("Failed to create file!")
            }
        })
    }

    function runCurrentFile() {
        const fileType = selectedFile.split(".")[1]
        if (EditorConfig.supportedLanguages[fileType]) {
            let command = EditorConfig.supportedLanguages[fileType] + " " + selectedFile

            nm.send("executerCommand", {command: command})
        }

    }

    if (!selectedProject) return null
    return (
        <div id="main-editor">
            <div id="navbar">
                <h2 id="navbar-title">{'CodeJam</>'}</h2>
                <div id="project-name">
                    <h2 className="badge text-bg-secondary">{selectedProject.name}</h2>
                    <div id="save-indicator">
                        {renderSaveIndicator()}
                    </div>
                </div>
                <div id="navbar-side-buttons">
                    <ImageButton src="./client/assets/images/run-icon.png" enabled={runEnabled.current} onClick={runCurrentFile}/>
                </div>
            </div>
            <div id="editor-container" className={isLoading ? "disabled" : ""}>
                <div id="editor-nav">
                    <div id="file-list-title">
                        <h3>Files:</h3>
                        <img src="./client/assets/images/new-file-icon.png" id="create-file-icon" onClick={createNewFile} />
                    </div>
                    <div id="file-list">
                        {renderFileList()}
                    </div>
                </div>
                <SelectedFileNameContext.Provider value={selectedFile}>
                    <LoadingContext.Provider value={setLoading}>
                        <CodeEditor fileSaved={setFileSaved}/>
                    </LoadingContext.Provider>
                </SelectedFileNameContext.Provider>
            </div>
            <div id="loading-spinner" className="spinner-border" role="status" 
            style={isLoading ? {} : { display: "none" }}/>
        </div>
    )
}