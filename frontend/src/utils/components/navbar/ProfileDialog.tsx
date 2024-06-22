import { useState } from "react";
import { useNetwork } from "../../providers/net-provider";
import { toast } from "sonner";
import React from "react";
import { useAuth } from "../../providers/auth-provider";
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import { ProfileEditorDialog } from "./profile-editor";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";


export function ProfileDialog() {
    const {user, logout} = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const openAvatarMenu = Boolean(anchorEl);
    const nm = useNetwork()

    const closeMenu = () => {setAnchorEl(null);}
    const closeDialog = () => {setOpenProfileDialog(false);}

    function handleUEdit(event: React.FormEvent<HTMLFormElement>) {
        // Update user credentials
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        nm.send("updateUserCredentials", {username: form.get("username") as string, email: form.get("email") as string})
            .then((response) => {
                if (response.success) {
                    toast.success("Profile updated successfully!")
                } else {
                    toast.error(response.message)
                }
            })
    }

    function handlePEdit(event: React.FormEvent<HTMLFormElement>) {
        // Update password
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const password = form.get("newPassword") as string;
        const confirmPassword = form.get("confirmPassword") as string;
        if (password !== confirmPassword) {
            toast.warning("Passwords do not match!")
            return;
        }
        nm.send("updateUserPassword", {oldPassword: form.get("currentPassword") as string, newPassword: form.get("newPassword") as string})
            .then((response) => {
                if (response.success) {
                    toast.success("Password updated successfully!")
                } else {
                    toast.error("Password update failed!")
                }
            })
    }

    return (
        <div>
            <IconButton id="profile-button" onClick={(event: React.MouseEvent<HTMLElement>) => {
                setAnchorEl(event.currentTarget)
            }}>
                <Avatar sx={{ bgcolor: '#4f575c', color: 'white' }}>{user.username[0]}</Avatar>
            </IconButton>

            <Menu
                id="profile-menu"
                open={openAvatarMenu}
                anchorEl={anchorEl}
                onClose={closeMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}>
                <MenuItem onClick={() => {
                    setOpenProfileDialog(true)
                    closeMenu()
                }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <span>Edit Profile</span>
                        <EditIcon />
                    </Box>
                </MenuItem>
                <MenuItem onClick={() => {
                    logout();
                    closeMenu();
                }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <span>Logout</span>
                        <LogoutIcon />
                    </Box>
                </MenuItem>
            </Menu>
            
            <ProfileEditorDialog 
                open={openProfileDialog} 
                closeDialog={closeDialog} 
                handlePEdit={handlePEdit} 
                handleUEdit={handleUEdit}/>
        </div>
    );
}