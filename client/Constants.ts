

export class EditorConfig {
    public static readonly COOLDOWN_TIME = 100; // in ms
    public static readonly STORAGE_DIRECTORY = 
    window.location.protocol + "//" + window.location.hostname + "//Storage//";
    public static readonly AUTO_SAVE_TIME = 1500; // in ms
}

export class Assets {
    public static readonly ICONS = {
        PYTHON_ICON: "./client/assets/images/Python-icon.png",
        JS_ICON: "./client/assets/images/JavaScript-icon.png",
        JSON_ICON: "./client/assets/images/json-icon.png",
        DEFAULT_ICON: "./client/assets/images/default-file-icon.png"
    }
}

export interface ProjectInterface {
    id: string;
    name: string;
    description: string;
    author: string;
}

export interface ServerResponseInterface {
    success: boolean;
    data: any;
}