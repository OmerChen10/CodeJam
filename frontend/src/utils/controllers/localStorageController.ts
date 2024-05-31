import { ProjectInterface } from "../../config/constants";

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

    public static setProjectToken(projectToken: string) {
        localStorage.setItem("projectToken", projectToken);
    }

    public static removeProjectToken() {
        localStorage.removeItem("projectToken");
    }

    public static getProjectToken(): string | null {
        const project = localStorage.getItem("projectToken");
        if (project === "") return null;
        return project;
    }

    public static clear() {
        localStorage.clear();
    }
}