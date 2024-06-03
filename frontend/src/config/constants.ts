

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
    public static readonly monacoSupportedLanguages: { [key: string]: string } = {
        "py": "python",
        "js": "javascript",
    };
    public static readonly supportedLanguagesCommands: { [key: string]: string } = {
        "py": "python",
        "js": "node",
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
    id: number;
    name: string;
    description: string;
    author: string;
    isAdmin: boolean;
}

export interface UserInterface {
    username: string;
    email: string;
}

export interface MessageInterface {
    name: string;
    message: string;
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

interface UserListResponseInterface {
    users: UserInterface[];
}

interface ProjectResponseInterface {
    project: ProjectInterface;
    projectToken: string;
}

interface ProjectListResponseInterface {
    projects: ProjectInterface[];
}


type ServerResponse<T> = SuccessResponse<T> | ErrorResponse;
export type AnyResponse = ServerResponse<any>;
export type GenericResponse<T> = ServerResponse<T>;
export type UserResponse = ServerResponse<UserResponseInterface>;
export type ProjectResponse = ServerResponse<ProjectResponseInterface>;
export type ProjectListResponse = ServerResponse<ProjectListResponseInterface>;
export type UserListResponse = ServerResponse<UserListResponseInterface>;

