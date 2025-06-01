import { RouteConfig, ConditionalRoute } from "./common"
import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { Container, Typography } from "@mui/material"
import { HomePage } from "./pages/home/home-page"
import { Route, Routes } from "react-router-dom"
import { useProject } from "./providers"
import { SharedbController } from "./controllers"
import React from "react"

function App() {
    // Initialize ShareDBManager
    SharedbController.getInstance()
    const project = useProject()

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />}/>
            <Route path="/editor" element={
                <ConditionalRoute 
                    condition={project.currentProject !== null}
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
