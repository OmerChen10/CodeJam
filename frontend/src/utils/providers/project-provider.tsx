import { createContext, useContext, useEffect, useState } from "react";
import { ProjectInterface, RouteConfig } from "../../config";
import { useNetwork } from "./net-provider";
import { LocalStorageController } from "../localStorageController";
import React from "react";
import { LoadingScreen } from "../components";
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

    useEffect(() => {
        const project = LocalStorageController.getProject()
        if (project) {
            updateSelectedProject(project)
        }
    }, [])

    function updateSelectedProject(project: ProjectInterface) {
        nm.send("setCurrentProject", project).then((response) => {
            if (response.success) {
                setCurrentProject(project)
                LocalStorageController.setProject(project)
            }
        })
    }

    return (
        <ProjectContext.Provider value={{currentProject, setCurrentProject: updateSelectedProject}}>
            {children}
        </ProjectContext.Provider>
    )

}