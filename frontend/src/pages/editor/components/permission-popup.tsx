import { Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, styled } from "@mui/material";
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import PeopleIcon from '@mui/icons-material/People';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect } from "react";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useNetwork } from "../../../utils/providers/net-provider";
import { GenericResponse } from "../../../config";
import { toast } from "sonner";

const StyledDivider = styled(Divider)({
    backgroundColor: 'white',
    borderRightWidth: 2,
});

export function PermissionPopup() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [users, setUsers] = React.useState<string[]>([]);
    const [searchValue, setSearchValue] = React.useState<string>("");
    const open = Boolean(anchorEl);
    const nm = useNetwork();

    useEffect(() => {
        if (users === undefined || users.length === 0) {
            setUsers([])
        } 
        nm.send<GenericResponse<string[]>>("getUsersForProject", {}).then((response) => {
            if (response.success) {
                setUsers(response.data);
            }
        });
    }, [anchorEl]);

    function handleRemoveUser(username: string) {
        nm.send("removeUserFromProject", {username: username}).then((response) => {
            if (response.success) {
                setUsers(users.filter((user) => user !== username));
                toast.success("Successfully removed user");
            }
        });
    }

    function sendInvite() {
        if (searchValue === "") {
            toast.warning("Please enter a username");
            return;
        }
        nm.send("sendInvite", {username: searchValue}).then((response) => {
            if (response.success) {
                toast.success("Successfully sent invite");
            }
            else {
                toast.error(response.message)
            }
        });
    }
    
    function handleClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function renderUsers() {
        return (
            users.map((user) => {
                return (
                    <Box key={user} sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        p: 1,
                        bgcolor: "gray",
                        borderRadius: "0.5rem",
                    }}>
                        <Typography variant="h6">{user}</Typography>
                        <Avatar sx={{ bgcolor: '#4f575c', color: 'white' }}>{user[0]}</Avatar>
                        <StyledDivider orientation="vertical" flexItem/>
                        <IconButton onClick={() => {handleRemoveUser(user)}}>
                            <PersonRemoveIcon />
                        </IconButton>
                    </Box>
                );
            })
        );
    }

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <PeopleIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle variant="h4">Permissions:</DialogTitle>
                <DialogContent dividers>
                    <DialogActions>
                        <TextField
                            id="outlined-basic"
                            label="Send invite"
                            variant="outlined"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <IconButton onClick={sendInvite}>
                            <SendIcon />
                        </IconButton>
                    </DialogActions>
                </DialogContent>
                <Stack spacing={1} sx={{p: 1}}>
                    {renderUsers()}
                </Stack>
            </Dialog>
        </Box>
    );
}