import "./editor.css"
import { CodeEditor } from "./components/Editor"
import { createContext, useEffect, useRef, useState } from "react"
import { useNetwork, useProject } from "../../utils/"
import { FileButton } from "./components/fileButton"
import { toast } from "sonner"
import { EditorConfig } from "../../config/constants"
import { EditorNavbar } from "./components/navbar"
import { ConfirmDialog } from "../../utils/components"
import React from "react"
import { Button, Container, Dialog, DialogActions, DialogContentText, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material"
import NoteAddIcon from '@mui/icons-material/NoteAdd';


export const LoadingContext = createContext<(loading: boolean) => void>(() => {})

export function EditorPage() {
    const [fileList, setFileList] = useState<string[]>([])
    const [currentFileName, setCurrentFileName] = useState<string>("")
    const [isLoading, setLoading] = useState<boolean>(false)
    const [fileSaved, setFileSaved] = useState<boolean>(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const createFileMenuOpen = Boolean(anchorEl)

    const fileNameToDelete = useRef<string>("")


    const nm = useNetwork()
    const { currentProject, setCurrentProject } = useProject()
    const runEnabled = useRef(false)

    useEffect(() => {
        nm.send("joinSession")
        nm.send("getProjectFilePaths").then((response) => {
            if (response.success) {
                setFileList(response.data)
            }
        })
    }, [])

    function renderFileList() {
        return fileList.map((fileName) => {
            return <FileButton fileName={fileName} key={fileName} selected={fileName === currentFileName}
                onOpen={() => {
                    setCurrentFileName(fileName)
                    runEnabled.current = fileName.split(".")[1] in EditorConfig.supportedLanguagesCommands
                }}
                onRename={
                    (oldName: string, newName: string) => {
                        setFileList(fileList.map((name) => {
                            if (name === oldName) {
                                return newName
                            }
                            return name
                        }))
                        if (currentFileName === oldName) {
                            setCurrentFileName(newName)
                        }
                    }
                }
                onDelete={() => {
                    setOpenDeleteDialog(true)
                    fileNameToDelete.current = fileName
                }}/>
        })
    }

    function runCurrentFile() {
        const fileType = currentFileName.split(".")[1]
        if (EditorConfig.supportedLanguagesCommands[fileType]) {
            let command = EditorConfig.supportedLanguagesCommands[fileType] + " " + currentFileName

            nm.send("executerCommand", {command: command})
        }

    }

    function deleteFile(fileName: string) {
        nm.send("deleteFile", {name: fileName}).then((response) => {
            if (response.success) {
                toast.success("File deleted successfully!")
                if (fileName === currentFileName) {
                    setCurrentFileName("")
                }
                setFileList(fileList.filter((name) => name !== fileName))
            }
            else {
                toast.error("Failed to delete file!")
            }
        })
    }

    function onSubmitCreateFile(event: React.FormEvent<HTMLFormElement>) {
        setAnchorEl(null)
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const name = formData.get("name") as string
        if (!name) return
        
        nm.send("createFile", {name: name}).then((response) => {
            if (response.success) {
                toast.success("File created successfully!")
                setFileList([...fileList, name])
            }
            else {
                toast.error("Failed to create file!")
            }
        })
    }

    if (!currentProject) return null
    return (
        <div id="main-editor">
            <EditorNavbar runCurrentFile={runCurrentFile} selectedProject={currentProject} runEnabled={runEnabled.current} fileSaved={fileSaved}/>
            <div id="editor-container" className={isLoading ? "disabled" : ""}>
                <div id="editor-nav">
                    <div id="file-list-title">
                        <h3>Files:</h3>
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                            <NoteAddIcon/>
                        </IconButton>
                    </div>
                    <Stack direction="column" spacing={1.5} sx={{p: '0.5rem 0.5rem'}}>
                        {renderFileList()}
                    </Stack>
                </div>
                {currentFileName !== "" ? <LoadingContext.Provider value={setLoading}>
                    <CodeEditor fileSaved={setFileSaved} currFileName={currentFileName}/>
                </LoadingContext.Provider> :
                <Typography variant="h5" sx={{margin: "auto"}}>Select a file to edit</Typography>} 
            </div>
            <div id="loading-spinner" className="spinner-border" role="status" 
            style={isLoading ? {} : { display: "none" }}/>

            <ConfirmDialog openDialog={openDeleteDialog} setOpenDialog={setOpenDeleteDialog} onConfirm={() => deleteFile(fileNameToDelete.current)}>
                Delete
            </ConfirmDialog>

            <Dialog
                open={createFileMenuOpen}
                onClose={() => setAnchorEl(null)}
            >
                <Container component="form" onSubmit={onSubmitCreateFile}>
                    <DialogTitle>Create New File</DialogTitle>
                    <DialogContentText>
                        Please enter the name of the new file:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="File Name"
                        name="name"
                        type="text"
                        fullWidth
                    />
                    <DialogActions>
                        <Button variant='contained' onClick={() => setAnchorEl(null)}>Cancel</Button>
                        <Button variant='contained' type="submit">Create</Button>
                    </DialogActions>
                </Container>
            </Dialog>
        </div>
    )
}