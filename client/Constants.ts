

export class EditorConfig {
    public static readonly COOLDOWN_TIME = 100; // in ms
}

export interface ProjectInterface {
    id: string;
    name: string;
    description: string;
    owner: string;
}