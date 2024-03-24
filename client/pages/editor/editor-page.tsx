import "./editor.css"
import { CodeEditor } from "./components/Editor"
import { useContext, useEffect } from "react"
import { SelectedProjectContext } from "../../App"

export function EditorPage() {
    const selectedProject = useContext(SelectedProjectContext)

    return (
        <div id="main-editor">
            <div id="navbar">
                <h2 id="navbar-title">CodeJam</h2>
                <h2 id="project-name">New Project <span className="badge text-bg-secondary">Saved</span></h2>
            </div>
            <div id="editor-container">
                <div id="editor-nav">
                </div>
                <CodeEditor />
            </div>
        </div>
    )
}