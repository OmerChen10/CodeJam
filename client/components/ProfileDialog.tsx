import { useContext, useState } from "react";
import { currentUser } from "../App";
import { Dialog, TextField, DialogContent, Box, DialogTitle, DialogActions, Button } from "@mui/material";
import { NetworkManager } from "../Network/manager";
import { toast } from "sonner";


interface props {
    openDialog: boolean
    setOpenDialog: (open: boolean) => void
}

export function ProfileDialog({ openDialog, setOpenDialog }: props) {

    const [user, setUser] = useContext(currentUser);
    const nm = NetworkManager.getInstance();

    const handleClose = () => {
        setOpenDialog(false);
    };

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
            } else {
                toast.error('Failed to update profile');
            }
        });
        handleClose();

    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleClose}
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
                    value={user.username}
                />
                <TextField
                    required
                    margin="dense"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={user.email}
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
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
}