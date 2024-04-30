import { useContext, useState } from "react";
import { currentUser } from "../../App";
import { Dialog, TextField, DialogContent, Box, DialogTitle, DialogActions, Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { NetworkManager } from "../../network/manager";
import { toast } from "sonner";
import React from "react";

export function ProfileDialog() {

    const [user, setUser] = useContext(currentUser);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const openAvatarMenu = Boolean(anchorEl);
    const nm = NetworkManager.getInstance();

    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);

    const closeMenu = () => {setAnchorEl(null);}
    const closeDialog = () => {setOpenProfileDialog(false);}

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            email: formData.get('email') as string,
            currentPassword: formData.get('currentPassword') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
            username: formData.get('username') as string,
        };
        if (data.password !== data.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        nm.send("updateUserData", data, (response: any) => {
            if (response.success) {
                setUser(response.user);
                toast.success('Profile updated');
                window.location.reload();
            } else {
                toast.error('Failed to update profile');
            }
        });

        closeDialog();

    };

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
                }}>Profile</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
            <Dialog
                open={openProfileDialog}
                onClose={closeDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleSubmit(event);
                    },
                }}
            >
                <DialogTitle>Profile</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <TextField
                        required
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <TextField
                        required
                        margin="dense"
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}