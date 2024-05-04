import { useState } from "react";
import { ProjectInterface } from "../../../config/constants";
import { toast } from "sonner";
import React from "react";
import { useNetwork } from "../../../utils";

interface ProjectPropEditorProps {
    setPopUpMenuMode: (mode: string) => void;
    project: ProjectInterface;
    fetchProjects: () => void;
}

export function ProjectPropEditor({ setPopUpMenuMode, fetchProjects, project }: ProjectPropEditorProps) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);

    return (
        <div className="popUpWindow">
            <div id="prop-editor-container">
                <h1 id="prop-editor-title">Edit Project Properties</h1>
                <h2>Author: {project.author}</h2>
                <div className="input-container">
                    <input onChange={(e) =>{setName(e.target.value)}} type="text" className="input-group mb-3" value={name}/>
                    <textarea onChange={(e) =>{setDescription(e.target.value)}} id="project-description-editor" className="input-group mb-3" value={description}/>
                </div>
                <div className="button-container">
                    <button className="btn btn-success grey" 
                    onClick={() => {updateMetadata(); fetchProjects(); setPopUpMenuMode("none")}}>Save Changes</button>
                    <button className="btn btn-danger" onClick={() => {setPopUpMenuMode("none")}}>Cancel</button>
                </div>
            </div>
        </div>
    )

    function updateMetadata() {
        // Send the request to update the project
        let nm = useNetwork();
        nm.send("updateProjectMetadata", {id: project.id, name: name, description: description}).then((response) => {
            if (response.success){
                toast.success("Project updated successfully!");
                setPopUpMenuMode("none");
            } else {
                toast.error("Failed to update project");
            }
        });
    }
}
