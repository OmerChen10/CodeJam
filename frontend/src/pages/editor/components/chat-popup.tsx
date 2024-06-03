import { useEffect, useRef, useState } from "react";
import { GenericResponse, MessageInterface } from "../../../config/constants";
import { Badge, Box, Drawer, IconButton, Paper, Popover, Popper, Stack, TextField, Typography } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import React from "react";
import { useNetwork } from "../../../utils/providers/net-provider";
import CloseIcon from '@mui/icons-material/Close';

export function ChatDrawer() {
    const [messageList, setMessageList] = useState<MessageInterface[]>([]);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const nm = useNetwork();

    const unseenMessages = useRef(0);

    useEffect(() => {
        nm.onEvent<GenericResponse<MessageInterface>>("chatMessage", (response) => {
            if (!response.success) return;
            setMessageList([...messageList, response.data]);
            unseenMessages.current++;
        });
    })

    function sendMessage() {
        if (message.trim() === "") return;
        nm.send("broadcastChatMessage", message);
        setMessageList([...messageList, { name: "You", message }]);
        setMessage("");
    }

    function handleOpen(event: React.MouseEvent<HTMLElement>) {
        setOpen(true);
        unseenMessages.current = 0;
    }

    function handleKeyPress(event: React.KeyboardEvent) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    function renderMessages() {
        return messageList.map((message) => {
            return (
                <Box sx={{ borderRadius: "0.5rem", 
                           bgcolor: "#454b50", 
                           width: "fit-content", 
                           p: 1,
                           alignSelf: message.name === "You" ? 'flex-end' : 'flex-start'}}>
                    <Typography variant="h6" fontWeight={"bold"} sx={{textDecoration: "underline"}}>{message.name}</Typography>
                    <Typography variant="h6"> {message.message}</Typography>
                </Box>
            );
        });
    }

    return (
        <Box>
            <IconButton onClick={handleOpen}>
                <Badge badgeContent={unseenMessages.current} color="error">
                    <ChatIcon />
                </Badge>
            </IconButton>
            <Drawer anchor="right" open={open} variant="persistent">
                <Box sx={{bgcolor: "#313131"}}>
                    <IconButton onClick={() => {setOpen(false)}}>
                        <CloseIcon sx={{bgcolor: "#424242", borderRadius: "1rem", p: 0.1}}/>
                    </IconButton>
                </Box>
                <Typography variant="h5" sx={{color: "white", textAlign: "center", bgcolor: "#313131", textDecoration: "underline"}}>Chat</Typography>
                <Box sx={{bgcolor: "#313131", p: 1, height: "100%", display: "flex", flexDirection: "column-reverse"}}>
                    <Stack spacing={1} sx={{ p: 1, bgcolor: "#454b50", borderRadius: "0.5rem"}} direction="row">
                        <TextField
                            id="outlined-basic"
                            label="Message"
                            variant="outlined"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <IconButton onClick={sendMessage}>
                            <SendIcon />
                        </IconButton>
                    </Stack>
                    <Stack spacing={2} sx={{ p: 1, overflowY: 'auto', height: "95%", maxHeight: 'calc(100vh - 10rem)'}}>
                        {renderMessages()}
                    </Stack>
                    
                </Box>
            </Drawer>
        </Box>
    )
}
