import { useEffect, useRef, useState } from "react"



export function Terminal() {
    const testCwd = "/home/"
    const [terminalText, setTerminalText] = useState<string>(testCwd + "> ")
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [terminalText]);  // Update the scroll position whenever terminalText changes
    
    return (
        <div id="terminal">
            <div className="separator"/>
            <div id="terminal-header-text">
                Terminal
            </div>
            <div id="terminal-body">
                <textarea id="terminal-text" ref={textareaRef} onChange={handleChange} value={terminalText} onKeyDown={handleEnter}/>
            </div>
        </div>
    )

    function handleEnter(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter") {
            event.preventDefault()
            newLine()
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setTerminalText(event.target.value)
    }

    function newLine() {
        setTerminalText(terminalText + "\n" + testCwd + "> ")
    }
}

