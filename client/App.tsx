import { Route, BrowserRouter, Routes } from "react-router-dom"
import { NetworkManager } from "./Network/manager"

import { LoginPage } from "./pages/login-page/login-page"
import { EditorPage } from "./pages/editor/editor-page"
import { HomePage } from "./pages/home/home-page"
import { toast } from "sonner"

function App() {
    // Reconnect to the server each time a state changes
    NetworkManager.getInstance();
    
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
                