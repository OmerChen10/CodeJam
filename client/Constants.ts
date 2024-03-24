

export class EditorConfig {
    public static readonly COOLDOWN_TIME = 100; // in ms
}

export class Assets {
    public static readonly ICONS = {
        PYTHON_ICON: "./client/assets/images/Python-icon.png",
        JS_ICON: "./client/assets/images/JavaScript-icon.png",
        JSON_ICON: "./client/assets/images/json-icon.png"
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