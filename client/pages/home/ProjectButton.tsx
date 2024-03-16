

interface ButtonProps {
    children: string;
    onDelete?: () => void;
    onOpen?: () => void;
    onEdit?: () => void;
}

export function ProjectButton({ onOpen, onEdit, onDelete, children }: ButtonProps) {
    // On hover, display the button pannel

    return (     
        <div className="project-button button-blur">
            {children}
            {/* <div className="project-button-util-panel">
                <button className="btn btn-primary" onClick={onOpen}/>
                <button className="btn btn-warning" onClick={onEdit}/>
                <button className="btn btn-danger" onClick={onDelete}/>
            </div> */}
        </div>
    );
}
