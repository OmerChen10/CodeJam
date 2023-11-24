
interface ButtonProps {
    children: string;
    onClick: () => void;
}

function Button({ children, onClick}: ButtonProps) {

    return (
        <button className="btn btn-primary" onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
