import { ProjectInterface } from "../../../config/constants";
import React from "react";

interface ButtonProps {
    project: ProjectInterface;
    onEdit?: () => void;
    onDelete: (project: ProjectInterface) => void;
    onOpen?: () => void;
}

export function ProjectButton({ onEdit, onOpen, onDelete, project }: ButtonProps) {
    // If the project name length is greater than 20, add three dots at the end
    let name
    if (project.name.length > 20){
        name = project.name.substring(0, 20) + "...";
    }
    else {
        name = project.name;
    }

    return (     
        <div className="project-button">
            <div className="button-text-background">{name}</div>
            <div className="project-button-util-panel">
                <button className="btn btn-secondary" onClick={onOpen}>Open</button>
                <button className="btn btn-secondary" onClick={onEdit}>Edit</button>
                <button className="btn btn-danger" onClick={() => {onDelete(project as ProjectInterface)}}>Delete</button>
            </div>
        </div>
    );
}
