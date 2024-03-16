import { ProjectPropEditor } from "./components/ProjectPropEditor.tsx";
import { ProjectCreator } from "./components/ProjectCreator.tsx";
import { ProjectButton } from "./components/ProjectButton.tsx";
import { ProjectInterface } from "../../Constants.ts";
import { NetworkManager } from "../../Network/manager";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "./home.css"

export function HomePage() {
    const [popUpMenuMode, setPopUpMenuMode] = useState("none");
    const [projectList, setProjectList] = useState([] as object[]);
    const [projectToEdit, setProjectToEdit] = useState({} as ProjectInterface);
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


    const renderPopUp = () => {
        switch (popUpMenuMode) {
            case "createProject":
                return <ProjectCreator setPopUpMenuMode={setPopUpMenuMode} sendCreateRequest={sendCreateRequest}/>
            case "editProjectProps":
                return <ProjectPropEditor setPopUpMenuMode={setPopUpMenuMode} project={projectToEdit}/>
            case "none":
                return null;
        }
    }
    
    const renderProjectButtons = () => {
        return projectList.map((project: any) => {
            return <ProjectButton 
                key={project.id} 
                name={project.name} 
                onDelete={() => {console.log("delete")}} 
                onOpen={() => {console.log("open")}} 
                onEdit={() => {
                    setProjectToEdit(project);
                    setPopUpMenuMode("editProjectProps");
                }}
            />});
    }

    return (
        <div id="main-home">
            <div id="navbar">
                <h3 id="title">CodeJam</h3>
            </div>
            <div id="projects-container" className={(popUpMenuMode != "none") ? "inactive" : "active"}>
                <div onClick={() => {setPopUpMenuMode("createProject")}} className="project-button" id="create-project-button">
                    <div className="project-button-text">Create New Project</div>
                    <div className="button-text-background" id="plus-icon"/>
                </div>
                {renderProjectButtons()}
            </div>
            {renderPopUp()}
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
                getProjects();
                setPopUpMenuMode("none");
            }
            else {
                toast.error("Failed to create project");
                setPopUpMenuMode("none");
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