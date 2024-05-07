import { createContext, useContext, useEffect, useState } from "react";
import { ProjectInterface, ProjectListResponse, ProjectResponse, RouteConfig } from "../../config";
import { useNetwork } from "./net-provider";
import { LocalStorageController } from "../localStorageController";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ProjectProviderInterface {
    currentProject: ProjectInterface;
    setCurrentProject: (project: ProjectInterface) => void;
}

const ProjectContext = createContext<ProjectProviderInterface>(null!);

export function useProject() {
    return useContext(ProjectContext);
}

export function ProjectProvider({children}: {children: React.ReactNode}) {
    const [currentProject, setCurrentProject] = useState<ProjectInterface>(null!);
    const nm = useNetwork();
    const navigate = useNavigate();

    useEffect(() => {
        const project = LocalStorageController.getProject()
        if (project) {
            updateSelectedProject(project)
        }
    }, [])

    function updateSelectedProject(project: ProjectInterface) {
        nm.send<ProjectResponse>("setCurrentProject", project.id).then((response) => {
            if (response.success) {
                LocalStorageController.setProject(response.data)
                setCurrentProject(response.data)
            } else {
                LocalStorageController.removeProject()
                setCurrentProject(null!)
                navigate(RouteConfig.HOME)
            }
        })
    }

    return (
        <ProjectContext.Provider value={{currentProject, setCurrentProject: updateSelectedProject}}>
            {children}
        </ProjectContext.Provider>
    )

}