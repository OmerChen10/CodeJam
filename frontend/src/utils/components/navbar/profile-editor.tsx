import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../providers/auth-provider";

interface ProfileEditorDialogProps {
    open: boolean;
    closeDialog: () => void;
    handleUEdit: (event: React.FormEvent<HTMLFormElement>) => void;
    handlePEdit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ProfileEditorDialog({ open, closeDialog, handlePEdit, handleUEdit}: ProfileEditorDialogProps) {
    const {user} = useAuth();
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>Profile</DialogTitle>
            <DialogContent dividers>
                <Container 
                component='form' 
                onSubmit= {(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    handleUEdit(event);}
                }>
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
                    <DialogActions>
                        <Button type="submit" variant="contained">Save</Button>
                    </DialogActions>
                </Container>

                <Container 
                component='form' 
                onSubmit= {(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    handlePEdit(event);}
                }>
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
                        name="newPassword"
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
                    <DialogActions>
                        <Button type="submit" variant="contained">Save</Button>
                    </DialogActions>
                </Container>
            </DialogContent>
        </Dialog>
    )
}