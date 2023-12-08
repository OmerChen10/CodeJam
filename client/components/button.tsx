

interface ButtonProps {
    children: string;
    onClick: () => void;
}
function Button({ onClick, children }: ButtonProps) {
    return (
        
        <button className="btn btn-primary" onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
