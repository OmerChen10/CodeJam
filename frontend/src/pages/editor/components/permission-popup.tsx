import { Box } from "@mui/material";
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Popover from "@mui/material/Popover"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import PeopleIcon from '@mui/icons-material/People';
import SendIcon from '@mui/icons-material/Send';
import React from "react";

export function PermissionPopup() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    function handleClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function renderUsers() {
        return (
            <h5>User</h5>
        );
    }

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <PeopleIcon />
            </IconButton>
            <Popover open={open} onClose={handleClose}>
                <Container>
                    <Typography variant="h2">Permissions</Typography>
                    <Divider variant="fullWidth"/>
                    <Container>
                        <TextField/>
                        <IconButton>
                            <SendIcon/>
                        </IconButton>
                    </Container>
                    <Typography variant="h3">Users</Typography>
                    {renderUsers()}
                </Container>
            </Popover>
        </Box>
    );
}