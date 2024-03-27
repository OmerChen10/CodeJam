import { useEffect, useRef, useState } from "react"
import { Assets } from "../../../Constants"

interface props {
    filePath: string
    onClick?: () => void
}

export function FileButton({filePath, onClick}: props) {
    const [fileTypeImgSrc, setFileTypeImgSrc] = useState<string>("")
    let fileName = filePath.split("\\").pop() as string


    function generateFileName() {
        if (fileName.length > 10) fileName = fileName.substring(0, 10) + "..."
        return fileName.split(".")[0]
    }

    useEffect(() => {
        let fileParts = filePath.split(".")
        switch (fileParts[fileParts.length - 1]) {
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
        <div onClick={onClick} className="file-button">
            <div className="file-name-text">
                <h3>{generateFileName()}</h3>
                <img src={fileTypeImgSrc} className="file-extension-img"/>
            </div>
            <div className="file-button-tools">
                <img src="./client/assets/images/edit-icon.png" className="edit-icon"/>
                <img src="./client/assets/images/trash-icon.png" className="edit-icon"/>
            </div>
        </div>
    )
}