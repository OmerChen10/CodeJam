import { useEffect, useRef, useState } from "react"
import { NetworkManager } from "../../../Network/manager"


export function Terminal() {
    const [cwd, setCwd] = useState<string>("")
    const nm = NetworkManager.getInstance()
    const [output, setOutput] = useState<string>("")
    const [input, setInput] = useState<string>(cwd + "> ")

    useEffect(() => {
        nm.send("createExecuter", {}, (response) => {
            console.log(response.data)
            setCwd(response.data)
        })

        nm.onEvent("executerCwd", (response) => {
            console.log(response.data)
            setCwd(response.data)
        })

        nm.onEvent("executerStdout", (stdout) => {
            // if the last character is a newline, remove it
            addOutput(stdout.data)
        })

        nm.onEvent("executerStderr", (stderr) => {
            addOutput(stderr.data)
        })
    }, [])

    useEffect(() => {
        const outputElement = document.getElementById("terminal-output")
        outputElement!.scrollTop = outputElement!.scrollHeight
    }, [output])

    useEffect(() => {
        setInput(cwd + "> " + input.substring(cwd.length + 2))
    }, [cwd])

    function handleInputChange (event: any) {
        setInput(event.target.value)
    }

    function handleKeyDown(event: any) {
        // check if the user tries to delete the cwd
        if (event.key === "Backspace" && input === cwd + "> ") {
            event.preventDefault()
        }
        if (event.key === "Enter") {
            event.preventDefault()
            let cmd = input.substring(cwd.length + 2)
            if (cmd != "") {
                nm.send("executerCommand", {command: cmd})
            }

            setInput(cwd + "> ")
        }
    }

    function addOutput(text: string) {
        setOutput((prevOutput) => prevOutput + text);
    }

    return (
        <div id="terminal">
            <div className="separator"/>
            <div id="terminal-body">
                <textarea id="terminal-input" value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
                <textarea id="terminal-output" value={output} onChange={() => {}}/>
            </div>
        </div>
    )
}