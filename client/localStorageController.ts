import { ProjectInterface } from "./Constants";

export class LocalStorageController {
    
    public static getUserToken(): string {
        return localStorage.getItem("userToken") || "";
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

    public static getProject(): ProjectInterface {
        const project = localStorage.getItem("project") || "";
        if (project === "") return {} as ProjectInterface;
        return JSON.parse(project);
    }
}