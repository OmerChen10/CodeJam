import './image-button.css'
import React from 'react'

interface props {
    onClick: () => void
    enabled: boolean
    src: string
    style?: React.CSSProperties
}

export function ImageButton({onClick, enabled, src, style}: props) {
    // A button wrapper that contains an image
    return (
        <div className={`image-button-wrapper ${enabled ? "" : "disabled-button"}`}>
            <img src={src} onClick={onClick} style={style}/>  
        </div>
    )
}