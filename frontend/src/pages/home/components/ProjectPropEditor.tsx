import { useState } from "react";
import { ProjectInterface } from "../../../config/constants";
import { toast } from "sonner";
import React from "react";
import { useNetwork } from "../../../utils";
import { TextField } from "@mui/material";

interface ProjectPropEditorProps {
    setPopUpMenuMode: (mode: string) => void;
    project: ProjectInterface;
    fetchProjects: () => void;
}

export function ProjectPropEditor({ setPopUpMenuMode, fetchProjects, project }: ProjectPropEditorProps) {
    const [projectName, setProjectName] = useState(project.name);
    const [projectDescription, setProjectDescription] = useState(project.description);
    const nm = useNetwork();
    
    function updateMetadata(name: string, description: string) {  
        // Send the request to update the project
        nm.send("updateProjectMetadata", {id: project.id, name: name, description: description}).then((response) => {
            if (response.success){
                toast.success("Project updated successfully!");
                setPopUpMenuMode("none");
            } else {
                toast.error("Failed to update project");
            }
        });
    }

    function handleSaveChanges(e) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        console.log(form);
        // Save the changes to the project
        updateMetadata(form.get("project-name") as string, form.get("project-description") as string);
        fetchProjects();
        setPopUpMenuMode("none");   
    } 

    return (
        <div className="popUpWindow">
            <div id="prop-editor-container">
                <h1 id="prop-editor-title">Edit Project Properties</h1>
                <h2>Author: {project.author}</h2>
                <form className="input-container" onSubmit={handleSaveChanges}>
                    <TextField 
                        id="project-name-editor"   
                        label="Project Name" 
                        name="project-name" 
                        value={projectName}
                        variant="outlined"
                        fullWidth
                        onChange={(event) => {
                            setProjectName(event.target.value);
                        }}
                    />
                    <TextField
                        id="project-description-editor"
                        label="Project Description"
                        name="project-description"
                        value={projectDescription}
                        multiline
                        rows={4} // Adjust the number of rows as needed
                        variant="outlined"
                        fullWidth
                        onChange={(event) => {
                            setProjectDescription(event.target.value);
                        }}
                        />
                    <div className="button-container">
                        <button className="btn btn-success grey" type="submit">Save Changes</button>
                        <button className="btn btn-danger" onClick={() => {setPopUpMenuMode("none")}}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
