import { createContext, useContext, useEffect, useState } from "react";
import { ProjectInterface, ProjectResponse, RouteConfig } from "../../config";
import { useNetwork } from "./net-provider";
import { LocalStorageController } from "../controllers";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth-provider";

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
    const auth = useAuth();

    useEffect(() => {
        // Update project selection only if the user is authenticated
        auth.withAuth(() => {
            const projectToken = LocalStorageController.getProjectToken();
            if (projectToken) {
                nm.send<ProjectResponse>("setCurrentProjectToken", projectToken).then((response) => {
                    if (response.success) {
                        setCurrentProject(response.data.project)
                    }
                    else {
                        LocalStorageController.removeProjectToken()
                        setCurrentProject(null!)
                        navigate(RouteConfig.HOME)
                    }
                })
            }
        })
    }, [])

    function updateSelectedProject(project: ProjectInterface) {
        // Send request to set the current project
        nm.send<ProjectResponse>("setCurrentProject", project.id).then((response) => {
            if (response.success) {
                LocalStorageController.setProjectToken(response.data.projectToken)
                setCurrentProject(response.data.project)
            } else {
                LocalStorageController.removeProjectToken()
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