import { ProjectInterface } from "../../../Constants"
import { ImageButton } from "../../../components/ImageButton/ImageButton"
import { ProfileDialog } from "../../../components/dialogs/ProfileDialog"

interface props {
    runCurrentFile: () => void
    selectedProject: ProjectInterface
    runEnabled: boolean
    fileSaved: boolean
}

export function EditorNavbar({ runCurrentFile, selectedProject, runEnabled, fileSaved }: props) {
    const renderSaveIndicator = () => {
        if (fileSaved) {
            return <img src="./client/assets/images/checkmark-icon.png" />
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
                <ImageButton src="./client/assets/images/run-icon.png" enabled={runEnabled} onClick={runCurrentFile} />
                <ProfileDialog/>
            </div>
        </div>
    )
}