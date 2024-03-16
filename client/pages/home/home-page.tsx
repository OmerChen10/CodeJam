import { NetworkManager } from "../../Network/manager";
import { useEffect, useState } from "react";
import { ProjectButton } from "./ProjectButton.tsx";
import { toast } from "sonner";
import "./home.css"

export function HomePage() {
    const [projectCreatorOpen, setProjectCreatorOpen] = useState(false);
    const [projectList, setProjectList] = useState([] as object[]);
    const nm = NetworkManager.getInstance();
    
    useEffect(() => {
        // FOR DEVELOPMENT ONLY
        // AUTO LOGIN
        nm.addInitCallback(() => {
            nm.send("loginUser", {email: "omer@mail", password: "1234"}, (response: any) => {
                if (response.success) {
                    toast.success("Auto Logged in!");
                }
                else {
                    toast.error("Failed to login");
                }
            });

            getProjects();
        });
    }, []);

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
                        <button id="submit-button" className="btn btn-success grey" onClick={sendCreateRequest}>Create Project</button>
                        <button id="cancel-button" className="btn btn-danger" onClick={() => {setProjectCreatorOpen(false)}}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    let projectButtons = projectList.map((project: any) => {
        return (
            <ProjectButton key={project.id} onOpen={() => {console.log("Open")}} onEdit={() => {console.log("Edit")}} onDelete={() => {console.log("Delete")}}>
                {project.name}
            </ProjectButton>
        );
    });

    return (
        <div id="main-home">
            <div id="navbar">
                <h3 id="title">CodeJam</h3>
            </div>
            <div id="projects-container" className={projectCreatorOpen ? "inactive" : "active"}>
                <div onClick={() => {setProjectCreatorOpen(true)}} className="project-button" id="create-project-button">
                    <div className="project-button-text">Create New Project</div>
                    <div className="button-text-background" id="plus-icon"/>
                </div>
                {projectButtons}
            </div>
            {projectCreator}
        </div>
    );

    function sendCreateRequest() {
        let projectName = (document.getElementById("project-name") as HTMLInputElement).value;
        let projectDescription = (document.getElementById("project-description") as HTMLInputElement).value;

        // Send the request to create the project
        let nm = NetworkManager.getInstance();
        nm.send("createProject", {name: projectName, description: projectDescription}, (response: any) => {
            if (response.success){
                toast.success("Project created successfully!");
            }
            else {
                toast.error("Failed to create project");
            }
        });
    }

    function getProjects() {
        nm.send("getProjectListForUser", {}, (response: any) => {
            if (response.success){
                setProjectList(response.projects);
            }
            else {
                toast.error("Failed to get projects");
            }
        });
    }
}