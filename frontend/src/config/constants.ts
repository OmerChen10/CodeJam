

export class RouteConfig {
    public static readonly LOGIN = "/login";
    public static readonly HOME = "/";
    public static readonly EDITOR = "/editor";
}

export class EditorConfig {
    public static readonly COOLDOWN_TIME = 100; // in ms
    public static readonly STORAGE_DIRECTORY = 
    window.location.protocol + "//" + window.location.hostname + "//..//Storage//";
    public static readonly AUTO_SAVE_TIME = 1500; // in ms
    public static readonly supportedLanguages: { [key: string]: string } = {
        "py": "python"
    };
}

export class Assets {
    public static readonly ICONS = {
        PYTHON_ICON: "../assets/images/Python-icon.png",
        JS_ICON: "../assets/images/JavaScript-icon.png",
        JSON_ICON: "../assets/images/json-icon.png",
        DEFAULT_ICON: "../assets/images/default-file-icon.png"
    }
}

export interface ProjectInterface {
    id: string;
    name: string;
    description: string;
    author: string;
}

export interface UserInterface {
    username: string;
    email: string;
}

interface SuccessResponse<T> {
    success: true;
    data: T;
}

interface ErrorResponse {
    success: false;
    message: string;
}

interface UserResponseInterface {
    token: string;
    user: UserInterface;
}

interface ProjectListResponseInterface {
    projects: ProjectInterface[];
}

type ServerResponse<T> = SuccessResponse<T> | ErrorResponse;
export type GenericResponse = ServerResponse<any>;
export type UserResponse = ServerResponse<UserResponseInterface>;
export type ProjectResponse = ServerResponse<ProjectInterface>;
export type ProjectListResponse = ServerResponse<ProjectListResponseInterface>;
