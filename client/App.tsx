import { useRef } from "react"
import { NetworkManager } from "./Network/manager"
import { CodeEditor } from "./components/Editor"


function App() {
    const nm = useRef<NetworkManager>(NetworkManager.getInstance()).current
    return (    
        <div>
            <h1>CodeJam</h1>
            <CodeEditor></CodeEditor>
        </div> 
    )
}

export default App
                