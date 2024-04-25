import { Route, BrowserRouter, Routes } from "react-router-dom"
import { NetworkManager } from "./Network/manager"
import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { HomePage } from "./pages/home/home-page"
import { toast } from "sonner"
import { createContext, useEffect, useState } from "react"
import { ProjectInterface, UserInterface } from "./Constants"
import { LocalStorageController } from "./localStorageController"
import { useNavigate } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material"

export const SelectedProjectContext = createContext<[ProjectInterface, (project: ProjectInterface) => void]>([
    {} as ProjectInterface,
    () => {}
]);

export const currentUser = createContext<[UserInterface, (user: UserInterface) => void]>([
    {} as UserInterface,
    () => {}
]);

function App() {
    const [selectedProject, setSelectedProject] = useState({} as ProjectInterface)
    const [user, setUser] = useState({} as UserInterface)
    const nm = NetworkManager.getInstance()
    const navigate = useNavigate()

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    })

    useEffect(() => {
        autoNavigate();
        nm.onEvent("showToast", (response: any) => {
            toast.info(response.data);
        });
    }, []);

    function autoNavigate() {
        const token = LocalStorageController.getUserToken();
        const requestedEndpoint = document.location.pathname;

        if (!token) navigate("/");
        nm.send("autoLogin", {token: token}, (response: any) => {
            if (response.success) {
                setUser(response.user);
                switch (requestedEndpoint) {
                    case "/":
                        navigate("/home");
                        break;

                    case "/editor":
                        const selectedProject = LocalStorageController.getProject();
                        if (Object.keys(selectedProject).length !== 0) updateSelectedProject(selectedProject);
                        else navigate("/home");
                        break;

                    default:
                        navigate("/home");
                        break;
                }
            }
            else navigate("/");
        });
    }

    function updateSelectedProject(project: ProjectInterface) {
        nm.send("setCurrentProject", project);
        LocalStorageController.setProject(project);
        setSelectedProject(project);
    }

    function PrivatePage({children}: {children: any}) {
        if (Object.keys(user).length === 0) {
            return null;
        }
        return children;
    }
    
    return (    
        <ThemeProvider theme={darkTheme}>
            <currentUser.Provider value={[user, setUser]}>
                <SelectedProjectContext.Provider value={[selectedProject, updateSelectedProject]}>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/home" element={<PrivatePage><HomePage/></PrivatePage>} />
                        <Route path="/editor" element={<PrivatePage><EditorPage/></PrivatePage>} />
                    </Routes>
                </SelectedProjectContext.Provider>
            </currentUser.Provider>
        </ThemeProvider>
    )
}

export default App
                