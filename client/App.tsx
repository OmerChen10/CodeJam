import { Route, BrowserRouter, Routes } from "react-router-dom"
import { NetworkManager } from "./Network/manager"

import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { HomePage } from "./pages/home/home-page"
import { toast } from "sonner"

function App() {
    // Reconnect to the server each time a state changes
    let nm = NetworkManager.getInstance();

    // FOR DEVELOPMENT ONLY
    // AUTO LOGIN

    nm.setOnConnect(() => {
        nm.send("loginUser", {email: "omer@mail", password: "1234"}, (response: any) => {
            if (response.success) {
                toast.success("Auto logged in");
            }
            else {
                toast.error("Error auto logging in");
            }
        });
    });

    return (    
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/editor" element={<EditorPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
                