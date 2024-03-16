import { useState } from "react";
import { ProjectInterface } from "../../../Constants";

interface ProjectPropEditorProps {
    setPopUpMenuMode: (mode: string) => void;
    project: ProjectInterface;
}

export function ProjectPropEditor({ setPopUpMenuMode, project }: ProjectPropEditorProps) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);

    return (
        <div className="popUpWindow">
            <div id="prop-editor-container">
                <h1 id="prop-editor-title">Edit Project Properties</h1>
                <div className="input-container">
                    <input onChange={(e) =>{setName(e.target.value)}} type="text" className="input-group mb-3" value={name}/>
                    <textarea onChange={(e) =>{setDescription(e.target.value)}}id="project-description-editor" className="input-group mb-3" value={description}/>
                </div>
                <div className="button-container">
                    <button className="btn btn-success grey">Save Changes</button>
                    <button className="btn btn-danger" onClick={() => {setPopUpMenuMode("none")}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

// CSS
