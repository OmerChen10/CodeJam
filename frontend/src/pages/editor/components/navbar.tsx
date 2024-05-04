import { ProjectInterface } from "../../../config/constants"
import { ImageButton } from "../../../utils/components"
import { ProfileDialog } from "../../../utils/components"
import React from "react";

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
            <div id="project-name">
                <h2 className="badge text-bg-secondary">{selectedProject.name}</h2>
                <div id="save-indicator">
                    {renderSaveIndicator()}
                </div>
            </div>
            <div id="navbar-side-buttons">
                <ImageButton src="../../assets/images/run-icon.png" enabled={runEnabled} onClick={runCurrentFile} />
                <ProfileDialog/>
            </div>
        </div>
    )
}