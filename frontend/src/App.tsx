import { LocalStorageController } from "./utils/localStorageController"
import { ProjectInterface, RouteConfig, UserInterface } from "./config/constants"
import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { Route, Routes } from "react-router-dom"
import { useNetwork } from "./utils/net-provider"
import { HomePage } from "./pages/home/home-page"
import { createContext, useEffect, useState } from "react"
import React from "react"
import { ConditionalRoute } from "./utils/components"

export const SelectedProjectContext = createContext<[ProjectInterface, (project: ProjectInterface) => void]>([
    {} as ProjectInterface,
    () => { }
]);


function App() {
    const [selectedProject, setSelectedProject] = useState({} as ProjectInterface)
    const nm = useNetwork()

    useEffect(() => {
        const project = LocalStorageController.getProject()
        if (project) {
            updateSelectedProject(project)
        }
    }, [])

    function updateSelectedProject(project: ProjectInterface) {
        setSelectedProject(project);
        nm.send("setCurrentProject", project);
        LocalStorageController.setProject(project);
    }


    return (
        <SelectedProjectContext.Provider value={[selectedProject, updateSelectedProject]}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />}/>
                <Route path="/editor" element={
                    <ConditionalRoute condition={LocalStorageController.getProject() != null} fallback={RouteConfig.HOME}>
                        <EditorPage />
                    </ConditionalRoute>
                } />
            </Routes>
        </SelectedProjectContext.Provider>
    )
}

export default App
