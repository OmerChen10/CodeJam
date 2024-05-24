import { useEffect, useRef, useState } from "react"
import { useNetwork } from "../../../utils"
import React from "react";


export function Terminal() {
    const nm = useNetwork()
    const [output, setOutput] = useState<string>("")
    const [input, setInput] = useState<string>("> ")
    const commandHistory = useRef<string[]>([])

    useEffect(() => {
        nm.onEvent("executerStdout", (response) => {
            if (response.success) {
                addOutput(response.data)
            }
        })

    }, [])

    useEffect(() => {
        const outputElement = document.getElementById("terminal-output")
        outputElement!.scrollTop = outputElement!.scrollHeight
    }, [output])

    function handleInputChange (event: any) {
        setInput(event.target.value)
    }

    function handleKeyDown(event: any) {
        // check if the user tries to delete the cwd
        if (event.key === "Backspace" && input === "> ") {
            event.preventDefault()
        }
        if (event.key === "Enter") {
            event.preventDefault()
            let cmd = input.substring(2)
            if (cmd != "") {
                nm.send("executerCommand", {command: cmd})
                commandHistory.current.push(cmd)
            }

            setInput("> ")
        }

        if (event.key === "ArrowUp") {
            event.preventDefault()
            if (commandHistory.current.length === 0) return
            setInput("> " + commandHistory.current.pop()!)
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