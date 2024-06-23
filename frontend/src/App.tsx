import { RouteConfig } from "./config/constants"
import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/home/home-page"
import React from "react"
import { ConditionalRoute } from "./utils/components"
import { LocalStorageController, ShareDBManager, useAuth, useProject } from "./utils"
import { Container, Typography } from "@mui/material"

function App() {
    // Initialize ShareDBManager
    ShareDBManager.getInstance()
    const auth = useAuth()

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />}/>
            <Route path="/editor" element={
                <ConditionalRoute 
                    condition={auth.userToken !== null}
                    fallback={RouteConfig.HOME}
                >
                    <EditorPage />
                </ConditionalRoute>
            } />
            <Route path="*" element={
                <Container sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant="h2"> {'Page Not Found :('}</Typography>
                </Container>
            } />
        </Routes>
    )
}

export default App
