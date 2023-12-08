import React, { useState } from "react"
import Button from "./components/button"
import { NetworkManager } from "./Network/manager"

function App() {

    const [text, setText] = useState<string>("")
    const [nm, setNm] = useState<NetworkManager>(NetworkManager.getInstance())

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }

    return (    
        <div>
            <h1>CodeJam</h1>
            <input type="text" placeholder="Enter message" onChange={handleTextChange}/>
            <Button onClick={() => {nm.send("echo", text)}}>Send</Button>
        </div> 
    )
}

export default App
                