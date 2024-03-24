import { Route, BrowserRouter, Routes } from "react-router-dom"
import { NetworkManager } from "./Network/manager"

import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { HomePage } from "./pages/home/home-page"
import { toast } from "sonner"
import { createContext, useContext, useEffect, useState } from "react"
import { ProjectInterface } from "./Constants"


export const SelectedProjectContext = createContext<[ProjectInterface, (project: ProjectInterface) => void]>([
    {} as ProjectInterface,
    () => {}
]);

function App() {
    const [selectedProject, setSelectedProject] = useState({} as ProjectInterface)
    
    useEffect(() => {
        let nm = NetworkManager.getInstance();
        nm.addInitCallback(() => {
            nm.send("loginUser", {email: "omer@mail", password: "1234"}, (response: any) => {
                if (response.success) {
                    toast.success("Auto Logged in!");
                }
                else {
                    toast.error("Failed to login");
                }
            });
        });
    }, []);
    
    return (    
        <SelectedProjectContext.Provider value={[selectedProject, setSelectedProject]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/editor" element={<EditorPage />} />
                </Routes>
            </BrowserRouter>
        </SelectedProjectContext.Provider>
    )
}

export default App
                