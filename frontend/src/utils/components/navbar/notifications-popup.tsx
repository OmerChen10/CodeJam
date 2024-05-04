import { Badge, Box, Button, Container, Divider, IconButton, Popover, Stack } from "@mui/material";
import { ProjectInterface, ProjectListResponse } from "../../../config";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNetwork } from "../../net-provider";
import { useEffect, useState } from "react";
import React from "react";

export function NotificationPopup() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<ProjectInterface[]>([]);
    const openNotifications = Boolean(anchorEl);
    const nm = useNetwork();
    function handleClose() { setAnchorEl(null) }

    useEffect(() => {
        nm.send<ProjectListResponse>("getInvitationRequests", {}).then((response) => {
            if (response.success) {
                setNotifications(response.data.projects);
            }
        });
    }, []);

    function declineInvite(project: ProjectInterface) {
        console.log("Declining invite");
        nm.send("declineInvite", { id: project.id });
           setNotifications(notifications.filter((p) => p.id !== project.id));
    }

    function acceptInvite(project: ProjectInterface) {
        console.log("Accepting invite");
        nm.send("acceptInvite", { id: project.id })
        setNotifications(notifications.filter((p) => p.id !== project.id));
    }

    function renderNotifications() {
        if (notifications.length === 0) {
            return <h5>No new notifications</h5>;
        }
        return notifications.map((project: ProjectInterface) => {
            return (<InviteRequest
                project={project}
                onDecline={declineInvite}
                onAccept={acceptInvite}
                key={project.id}
            />);
        });
    }

    return (
        <Box>
            <IconButton onClick={(event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget) }}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                open={openNotifications}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack spacing={1} sx={{ p: 2 }}>
                    {renderNotifications()}
                </Stack>
            </Popover>
        </Box>
    );
}

interface InviteRequestProps {
    project: ProjectInterface
    onDecline: (project: ProjectInterface) => void
    onAccept: (project: ProjectInterface) => void
}

function InviteRequest({ project, onDecline, onAccept }: InviteRequestProps) {
    return (
        <Container sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0.5rem",
            backgroundColor: "#3a3b3b",
            borderRadius: "0.5rem"

        }}>
            <h6>Invitation for: {project.name}, By: {project.author}</h6>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                <Button color="success" variant="contained" size="small" onClick={() => { onAccept(project) }}>Accept</Button>
                <Button color="error" variant="contained" size="small" onClick={() => { onDecline(project) }}>Decline</Button>
            </Box>
        </Container>
    );
}

