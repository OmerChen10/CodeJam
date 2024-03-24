import { useEffect, useRef, useState } from "react"
import { Assets } from "../../../Constants"

interface props {
    fileName: string
}

export function FileButton({fileName}: props) {
    const [fileTypeImgSrc, setFileTypeImgSrc] = useState<string>("")

    useEffect(() => {
        switch (fileName.split(".")[1]) {
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
        <div className="file-button">
            <h3>{fileName}</h3>
            <img src={fileTypeImgSrc}/>
        </div>
    )
}