import { LocalStorageController } from "./utils/localStorageController"
import { ProjectInterface, UserInterface } from "./config/constants"
import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { Route, Routes } from "react-router-dom"
import { NetworkManager } from "./network/manager"
import { HomePage } from "./pages/home/home-page"
import { toast } from "sonner"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material"
import React from "react"
import { blueGrey } from "@mui/material/colors"

export const SelectedProjectContext = createContext<[ProjectInterface, (project: ProjectInterface) => void]>([
    {} as ProjectInterface,
    () => { }
]);

export const currentUser = createContext<[UserInterface, (user: UserInterface) => void]>([
    {} as UserInterface,
    () => { }
]);

function App() {
    const [selectedProject, setSelectedProject] = useState({} as ProjectInterface)
    const [user, setUser] = useState({} as UserInterface)
    const nm = NetworkManager.getInstance()
    const navigate = useNavigate()

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            secondary: {
                light: blueGrey[300],
                main: blueGrey[500],
                dark: blueGrey[700],
                contrastText: "#fff"
            }
        },
        typography: {
            button: {
                fontWeight: 'bold'
            }
        }
    })

    useEffect(() => {
        autoNavigate();
        nm.onEvent("showToast", (response: any) => {
            toast.info(response.data);
        });
    }, []);

    function updateSelectedProject(project: ProjectInterface) {
        setSelectedProject(project);
        nm.send("setCurrentProject", project);
        LocalStorageController.setProject(project);
    }

    function autoNavigate() {
        const token = LocalStorageController.getUserToken();
        const requestedEndpoint = document.location.pathname;

        if (!token) navigate("/");
        nm.send("autoLogin", { token: token }, (response: any) => {
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

    function PrivatePage({ children }: { children: any }) {
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
                        <Route path="/home" element={<PrivatePage><HomePage /></PrivatePage>} />
                        <Route path="/editor" element={<PrivatePage><EditorPage /></PrivatePage>} />
                    </Routes>
                </SelectedProjectContext.Provider>
            </currentUser.Provider>
        </ThemeProvider>
    )
}

export default App
