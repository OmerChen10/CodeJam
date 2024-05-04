import { ProjectInterface } from "../../../config/constants"
import { ImageButton, NotificationPopup } from "../../../utils/components"
import { ProfileDialog } from "../../../utils/components"
import React from "react";
import { PermissionPopup } from "./permission-popup";
import { IconButton, Paper } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface props {
    runCurrentFile: () => void
    selectedProject: ProjectInterface
    runEnabled: boolean
    fileSaved: boolean
}

export function EditorNavbar({ runCurrentFile, selectedProject, runEnabled, fileSaved }: props) {
    const renderSaveIndicator = () => {
        if (fileSaved) {
            return <img src="../../assets/images/checkmark-icon.png" />
        }
        return <div id="save-spinner" className="spinner-border" role="status" />
    }

    return (
        <div id="navbar">
            <h2 id="navbar-title">{'CodeJam</>'}</h2>
            <PermissionPopup />
            <div id="project-name">
                <h2 className="badge text-bg-secondary">{selectedProject.name}</h2>
                <div id="save-indicator">
                    {renderSaveIndicator()}
                </div>
            </div>
            <div id="navbar-side-buttons">
                <Paper elevation={3} sx={{borderRadius: "100%"}}>
                    <IconButton onClick={runCurrentFile} disabled={!runEnabled}>
                        <PlayArrowIcon sx={runEnabled ? {color: "lightgreen"} : {color: "gray"}}/>
                    </IconButton>
                </Paper>
                <NotificationPopup />
                <ProfileDialog/>
            </div>
        </div>
    )
}