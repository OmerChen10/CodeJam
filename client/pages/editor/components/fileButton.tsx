import { useEffect, useRef, useState } from "react"
import { Assets } from "../../../Constants"

interface props {
    filePath: string
    onClick?: () => void
}

export function FileButton({filePath, onClick}: props) {
    const [fileTypeImgSrc, setFileTypeImgSrc] = useState<string>("")
    const fileName = filePath.split("\\").pop() as string

    useEffect(() => {
        switch (fileName.split(".").pop()) {
            case "py":
                setFileTypeImgSrc(Assets.ICONS.PYTHON_ICON)
                break;
            case "js":
                setFileTypeImgSrc(Assets.ICONS.JS_ICON)
                break;
            case "json":
                setFileTypeImgSrc(Assets.ICONS.JSON_ICON)
                
        }
    }, [])

    return (
        <div onClick={onClick} className="file-button">
            <h3>{fileName}</h3>
            <img src={fileTypeImgSrc}/>
        </div>
    )
}