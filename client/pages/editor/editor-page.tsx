import "./editor.css"
import { CodeEditor } from "./components/Editor"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { SelectedProjectContext } from "../../App"
import { NetworkManager } from "../../Network/manager"
import { FileButton } from "./components/fileButton"
import { toast } from "sonner"
import { EditorConfig } from "../../Constants"
import { EditorNavbar } from "./components/navbar"
import { ConfirmDialog } from "../../components/dialogs/ConfirmDialog"

export const LoadingContext = createContext<(loading: boolean) => void>(() => {})

export function EditorPage() {
    const [fileList, setFileList] = useState<string[]>([])
    const [selectedProject] = useContext(SelectedProjectContext)
    const [currentFileName, setCurrentFileName] = useState<string>("")
    const [prevFileName, setPrevFileName] = useState<string>("")
    const [isLoading, setLoading] = useState<boolean>(false)
    const [fileSaved, setFileSaved] = useState<boolean>(true)

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const fileNameToDelete = useRef<string>("")

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
                    setPrevFileName(currentFileName)
                    setCurrentFileName(fileName)
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
                    setOpenDeleteDialog(true)
                    fileNameToDelete.current = fileName
                }}/>
        })
    }

    function createNewFile() {
        let name = prompt("Enter the name of the new file:")
        if (!name) return
        
        nm.send("createFile", {name: name}, (response) => {
            if (response.success) {
                toast.success("File created successfully!")
                setFileList([...fileList, name])
            }
            else {
                toast.error("Failed to create file!")
            }
        })
    }

    function runCurrentFile() {
        const fileType = currentFileName.split(".")[1]
        if (EditorConfig.supportedLanguages[fileType]) {
            let command = EditorConfig.supportedLanguages[fileType] + " " + currentFileName

            nm.send("executerCommand", {command: command})
        }

    }

    function deleteFile(fileName: string) {
        nm.send("deleteFile", {name: fileName}, (response) => {
            if (response.success) {
                toast.success("File deleted successfully!")
                if (fileName === currentFileName) {
                    setCurrentFileName("")
                }
                if (fileName === prevFileName) {
                    setPrevFileName("")
                }
                setFileList(fileList.filter((name) => name !== fileName))
            }
            else {
                toast.error("Failed to delete file!")
            }
        })
    }

    if (!selectedProject) return null
    return (
        <div id="main-editor">
            <EditorNavbar runCurrentFile={runCurrentFile} selectedProject={selectedProject} runEnabled={runEnabled.current} fileSaved={fileSaved}/>
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
                <LoadingContext.Provider value={setLoading}>
                    <CodeEditor fileSaved={setFileSaved} currFileName={currentFileName} prevFileName={prevFileName}/>
                </LoadingContext.Provider>
            </div>
            <div id="loading-spinner" className="spinner-border" role="status" 
            style={isLoading ? {} : { display: "none" }}/>
            <ConfirmDialog openDialog={openDeleteDialog} setOpenDialog={setOpenDeleteDialog} onConfirm={() => deleteFile(fileNameToDelete.current)}>
                Delete
            </ConfirmDialog>
        </div>
    )
}