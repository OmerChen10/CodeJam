import { Route, BrowserRouter, Routes } from "react-router-dom"
import { HomePage } from "./pages/home/home-page"
import { EditorPage } from "./pages/editor/editor-page"
import { NetworkManager } from "./Network/manager"

function App() {
    // Reconnect to the server each time a state changes
    NetworkManager.getInstance();

    return (    
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/editor" element={<EditorPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
                