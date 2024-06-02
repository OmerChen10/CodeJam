import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useAuth } from "../../providers/auth-provider";
import CloseIcon from '@mui/icons-material/Close';
import { useNetwork } from "../../providers";
import { toast } from "sonner";

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    email: string;
}

export function EmailVerificationDialog({ open, setOpen, email }: props) {
    const [code, setCode] = useState("");
    const auth = useAuth();
    const nm = useNetwork();
    
    function resend() {
        // Resend email verification code
        nm.send("resendEmailCode").then((response) => {
            if (response.success) {
                toast.info("Email verification code sent!");
            }
        });
    }   

    return (
        <Dialog open={open}>
            <IconButton style={{ position: 'absolute', right: 0, top: 0 }} onClick={() => setOpen(false)}>
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Typography variant="h4" align="center">Email Verification</Typography>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="h6" align="center">A code was send to you email: {email}</Typography>
                        <TextField label="Code" variant="outlined" fullWidth value={code} onChange={(e) => setCode(e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Box display="flex" justifyContent="center" width="100%" gap={1}>
                        <Button variant="contained" onClick={() => {
                            // Verify email code
                            auth.verifyEmailCode(code);
                            setOpen(false);
                            
                        }}>Verify</Button>
                        <Button variant="outlined" onClick={resend}>Resend</Button>
                    </Box>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}