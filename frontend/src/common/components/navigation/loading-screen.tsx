import { CircularProgress, Container } from "@mui/material";
import React from "react";


export function LoadingScreen({ children }: { children: string }) {
    return (
        <Container sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh"
            }}>
            <CircularProgress size="5rem" sx={{color: "white", mb: "1rem"}}/>
            <h2>{children}</h2>
        </Container>
    )
}
