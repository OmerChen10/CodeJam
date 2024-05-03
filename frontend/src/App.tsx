import { LocalStorageController } from "./utils/localStorageController"
import { ProjectInterface, UserInterface } from "./config/constants"
import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { Route, Routes } from "react-router-dom"
import { useNetwork } from "./utils/net-provider"
import { HomePage } from "./pages/home/home-page"
import { createContext, useEffect, useState } from "react"
import React from "react"
import { ProtectedEndpoint } from "./utils"

export const SelectedProjectContext = createContext<[ProjectInterface, (project: ProjectInterface) => void]>([
    {} as ProjectInterface,
    () => { }
]);


function App() {
    const [selectedProject, setSelectedProject] = useState({} as ProjectInterface)
    const nm = useNetwork()

    function updateSelectedProject(project: ProjectInterface) {
        setSelectedProject(project);
        nm.send("setCurrentProject", project);
        LocalStorageController.setProject(project);
    }


    return (
        <SelectedProjectContext.Provider value={[selectedProject, updateSelectedProject]}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                    <ProtectedEndpoint>
                        <HomePage />
                    </ProtectedEndpoint>
                } />

                <Route path="/editor" element={
                    <ProtectedEndpoint requirement={LocalStorageController.getProject() != null}>
                        <EditorPage />
                    </ProtectedEndpoint>
                } />
            </Routes>
        </SelectedProjectContext.Provider>
    )
}

export default App
