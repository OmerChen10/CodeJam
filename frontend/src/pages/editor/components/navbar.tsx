import { ProjectInterface } from "../../../config/constants"
import { NotificationPopup } from "../../../utils/components"
import { ProfileDialog } from "../../../utils/components"
import React from "react";
import { PermissionPopup } from "./permission-popup";
import { IconButton, Paper } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNetwork, useProject } from "../../../utils";
import { ChatDrawer } from "./chat-popup";
import { toast } from "sonner";
import LoopIcon from '@mui/icons-material/Loop';
import SquareIcon from '@mui/icons-material/Square';

interface props {
    runCurrentFile: () => void
    selectedProject: ProjectInterface
    runEnabled: boolean
    fileSaved: boolean
}

export function EditorNavbar({ runCurrentFile, selectedProject, runEnabled, fileSaved }: props) {
    const { currentProject } = useProject();
    const nm = useNetwork();
    
    const renderSaveIndicator = () => {
        if (fileSaved) {
            return <img src="../../assets/images/checkmark-icon.png" />
        }
        return <div id="save-spinner" className="spinner-border" role="status" />
    }

    function handleRecreateContainer() {
        console.log("Recreating container")
        nm.send("recreateContainer").then((response) => {
            if (response.success) {
                toast.success("Container recreated successfully!")
            } else {
                toast.error("Failed to recreate container")
            }
        })
    }

    return (
        <div id="navbar">
            <h2 id="navbar-title">{'CodeJam</>'}</h2>
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
                <Paper elevation={3} sx={{borderRadius: "100%"}}>
                    <IconButton onClick={() => {nm.send("terminateContainerCommand")}}>
                        <SquareIcon sx={{color: '#b31105', fontSize: "1.4rem", p: '0.2rem'}}/>
                    </IconButton>
                </Paper>
                <IconButton onClick={handleRecreateContainer}>
                    <LoopIcon />
                </IconButton>
                <ChatDrawer />
                {currentProject.isAdmin ? <PermissionPopup /> : null}
                <NotificationPopup />
                <ProfileDialog/>
            </div>
        </div>
    )
}