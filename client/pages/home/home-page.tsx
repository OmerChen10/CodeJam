import { useState } from "react";
import "./home.css"

export function HomePage() {
    const [projectCreatorOpen, setProjectCreatorOpen] = useState(false);
    
    let projectCreator = null;
    if (projectCreatorOpen) {
        projectCreator = (
            <div id="project-creator">
                <div id="project-creator-container">
                    <h1 id="project-creator-title">Create New Project</h1>
                    <div id="project-creator-inputs">
                        <input type="text" className="input-group mb-3" id="project-name" placeholder="Project Name" aria-label="Project Name"/>
                        <input type="text" className="input-group mb-3" id="project-description" placeholder="Project Description" aria-label="Project Description"/>
                    </div>
                    <div id="project-creator-buttons">
                        <button id="submit-button" className="btn btn-success grey">Create Project</button>
                        <button id="cancel-button" className="btn btn-danger" onClick={() => {setProjectCreatorOpen(false)}}>Cancel</button>
                    </div>
                </div>
            </div>
        );
        openProjectCreator();
    }

    return (
        <div id="main-home">
            <div id="navbar">
                <h3 id="title">CodeJam</h3>
            </div>
            <div id="projects-container" className={projectCreatorOpen ? "inactive" : "active"}>
                <div onClick={() => {setProjectCreatorOpen(true)}} className="project-button" id="create-project-button">
                    <div className="project-button-text">Create New Project</div>
                    <div className="plus-icon"/>
                </div>
            </div>
            {projectCreator}
        </div>
    );
}

function openProjectCreator() {
    console.log("Opening project creator");
}