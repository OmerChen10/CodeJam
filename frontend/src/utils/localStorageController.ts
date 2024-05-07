import { ProjectInterface } from "../config/constants";

export class LocalStorageController {
    
    public static getUserToken(): string | null {
        return localStorage.getItem("userToken");
    }

    public static setUserToken(token: string) {
        localStorage.setItem("userToken", token);
    }

    public static removeUserToken() {
        localStorage.removeItem("userToken");
    }

    public static setProject(project: ProjectInterface) {
        localStorage.setItem("project", JSON.stringify(project));
    }

    public static removeProject() {
        localStorage.removeItem("project");
    }

    public static getProject(): ProjectInterface | null {
        const project = localStorage.getItem("project");
        if (project === "") return null;
        return JSON.parse(project!);
    }

    public static clear() {
        localStorage.clear();
    }
}