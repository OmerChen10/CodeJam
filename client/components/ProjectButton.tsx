

interface ButtonProps {
    children: string;
    onClick: () => void;
}

function ProjectButton({ onClick, children }: ButtonProps) {
    return (     
        <button className="btn btn-primary" onClick={onClick}>
            {children}
        </button>
    );
}

export default ProjectButton;
