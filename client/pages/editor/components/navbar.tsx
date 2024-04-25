import { useContext, useState } from "react"
import { currentUser } from "../../../App"
import { ProjectInterface } from "../../../Constants"
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material"
import { ImageButton } from "../../../components/ImageButton/ImageButton"
import { ProfileDialog } from "../../../components/ProfileDialog"

interface props {
    runCurrentFile: () => void
    selectedProject: ProjectInterface
    runEnabled: boolean
    fileSaved: boolean
}

export function EditorNavbar({ runCurrentFile, selectedProject, runEnabled, fileSaved }: props) {
    const [user, setUser] = useContext(currentUser)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [openProfileDialog, setOpenProfileDialog] = useState(false)
    const openAvatarMenu = Boolean(anchorEl)

    const renderSaveIndicator = () => {
        if (fileSaved) {
            return <img src="./client/assets/images/checkmark-icon.png" />
        }
        return <div id="save-spinner" className="spinner-border" role="status" />
    }

    const handleClose = () => {setAnchorEl(null)}

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
                <IconButton id="profile-button" onClick={(event: React.MouseEvent<HTMLElement>) => {
                    setAnchorEl(event.currentTarget)
                    }}>
                    <Avatar sx={{ bgcolor: '#4f575c', color: 'white'}}>{user.username[0]}</Avatar>
                </IconButton>
                <Menu
                    id="profile-menu"
                    open={openAvatarMenu}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}>
                    <MenuItem onClick={() => {
                        setOpenProfileDialog(true)
                        handleClose()
                    }}>Profile</MenuItem>
                    <MenuItem onClick={() => {}}>Logout</MenuItem>
                </Menu>
                <ProfileDialog openDialog={openProfileDialog} setOpenDialog={setOpenProfileDialog}/>
            </div>
        </div>
    )
}