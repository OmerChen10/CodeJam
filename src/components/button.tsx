import { useState } from 'react';

interface ButtonProps {
    children: string;
}

function Button({ children }: ButtonProps) {

    const [counter, setCounter] = useState(0);
    return (
        <button className="btn btn-success" onClick={() => { setCounter(counter + 1) }}>
            {children + counter}
        </button>
    );
}

export default Button;
