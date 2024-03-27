import { useEffect, useState } from "react"
import { NetworkManager } from "../../../Network/manager"
import { toast } from "sonner"
import { Assets } from "../../../Constants"

interface props {
    fileName: string
    onOpen: () => void
    onRename: (oldName: string, newName: string) => void
    onDelete: () => void
}

export function FileButton({fileName, onOpen, onRename, onDelete}: props) {
    const [fileTypeImgSrc, setFileTypeImgSrc] = useState<string>("")
    const [inputDisplayedText, setInputDisplayedText] = useState<string>("")
    const nm = NetworkManager.getInstance()
    const fileExtension = fileName.split(".")[1]

    function updateFileName() {
        if (fileName.length > 10) {
            setInputDisplayedText(fileName.substring(0, 10) + "...")
        }
        setInputDisplayedText(fileName)
    }

    function saveFileName() {
        nm.send("renameFile", 
        {oldName: fileName, newName: inputDisplayedText}, (response) => {
            if (response.success) {
                toast.success("File name updated successfully!")
                updateFileName()
            }
        })
        onRename(fileName, inputDisplayedText)
        fileName = inputDisplayedText
    }

    useEffect(() => {
        updateFileName()
        switch (fileExtension) {
            case "py":
                setFileTypeImgSrc(Assets.ICONS.PYTHON_ICON)
                break;
            case "js":
                setFileTypeImgSrc(Assets.ICONS.JS_ICON)
                break;
            case "json":
                setFileTypeImgSrc(Assets.ICONS.JSON_ICON)
                break;
            default:
                setFileTypeImgSrc(Assets.ICONS.DEFAULT_ICON)
                
        }
    }, [])

    return (
        <div onClick={onOpen} className="file-button">
            <div className="file-name-text">
                <input type="text" value={inputDisplayedText} className="file-name-input" onChange={
                    (e) => {setInputDisplayedText(e.target.value)}
                } onBlur={saveFileName}/>
                <img src={fileTypeImgSrc} className="file-extension-img"/>
            </div>
            <img src="./client/assets/images/trash-icon.png" onClick={onDelete} className="delete-icon"/>
        </div>
    )
}