

interface ButtonProps {
    children: string;
    onDelete?: () => void;
    onOpen?: () => void;
    onEdit?: () => void;
}

export function ProjectButton({ onOpen, onEdit, onDelete, children }: ButtonProps) {
    // On hover, display the button pannel

    return (     
        <div className="project-button">
            <div className="button-text-background">{children}</div>
            <div className="project-button-util-panel">
                <button className="btn btn-secondary" onClick={onOpen}>Open</button>
                <button className="btn btn-secondary" onClick={onEdit}>Edit</button>
                <button className="btn btn-danger" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}
