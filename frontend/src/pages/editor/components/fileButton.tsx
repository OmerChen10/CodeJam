import { useEffect, useRef, useState } from "react"
import { useNetwork } from "../../../utils/"
import { toast } from "sonner"
import { Assets } from "../../../config/constants"
import React from "react";
import { Box, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";

interface props {
    fileName: string
    onOpen: () => void
    onRename: (oldName: string, newName: string) => void
    onDelete: () => void
}

export function FileButton({fileName, onOpen, onRename, onDelete}: props) {
    const [fileTypeImgSrc, setFileTypeImgSrc] = useState<string>("")
    const [inputDisplayedText, setInputDisplayedText] = useState<string>("")
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [inputDisabled, setInputDisabled] = useState(true)
    const isMenuOpen = Boolean(anchorEl)

    const inputRef = useRef<HTMLInputElement>(null);

    const nm = useNetwork()
    const fileExtension = fileName.split(".")[1]

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

    useEffect(() => {
        if (!inputDisabled) {
            inputRef.current?.focus()
        }
    }, [inputDisabled])

    function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    function updateFileName() {
        if (fileName.length > 10) {
            setInputDisplayedText(fileName.substring(0, 10) + "...")
        }
        setInputDisplayedText(fileName)
    }

    function saveFileName() {
        nm.send("renameFile", 
        {oldName: fileName, newName: inputDisplayedText}).then((response) => {
            if (response.success) {
                toast.success("File name updated successfully!")
                updateFileName()
                onRename(fileName, inputDisplayedText)
                fileName = inputDisplayedText
            }
        })
    }

    function handleClose() {
        setAnchorEl(null)
        setInputDisabled(true)
    }

    function handleRename(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault()
        event.stopPropagation()
        setInputDisabled(false)
        setAnchorEl(null)
    
        // focus on the input field inside the currentTarget
        inputRef.current?.focus();    
        console.log(inputRef.current)
    }

    function handleDelete() {
        setAnchorEl(null)
        onDelete()
    }

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" onContextMenu={handleMenuOpen} onClick={onOpen}>
                <input type="text" value={inputDisplayedText} className="file-name-input" onChange={
                    (e) => {setInputDisplayedText(e.target.value)}
                } disabled={inputDisabled} ref={inputRef} onBlur={saveFileName}/>
                <img src={fileTypeImgSrc} alt="file icon" className="file-extension-img"/>
            </Stack>
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleClose}
            >
                <MenuItem onClick={handleRename}>Rename</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Box>
    )
}