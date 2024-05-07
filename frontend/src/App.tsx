import { RouteConfig } from "./config/constants"
import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/home/home-page"
import React from "react"
import { ConditionalRoute } from "./utils/components"
import { LocalStorageController } from "./utils"

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />}/>
            <Route path="/editor" element={
                <ConditionalRoute condition={LocalStorageController.getProject != null} fallback={RouteConfig.HOME}>
                    <EditorPage />
                </ConditionalRoute>
            } />
        </Routes>
    )
}

export default App
