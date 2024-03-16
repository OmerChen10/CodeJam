

interface ButtonProps {
    name: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onOpen?: () => void;
}

export function ProjectButton({ onEdit, onOpen, onDelete, name }: ButtonProps) {
    // If the project name length is greater than 20, add three dots at the end
    if (name.length > 20){
        name = name.substring(0, 20) + "...";
    }

    return (     
        <div className="project-button">
            <div className="button-text-background">{name}</div>
            <div className="project-button-util-panel">
                <button className="btn btn-secondary" onClick={onOpen}>Open</button>
                <button className="btn btn-secondary" onClick={onEdit}>Edit</button>
                <button className="btn btn-danger" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}
