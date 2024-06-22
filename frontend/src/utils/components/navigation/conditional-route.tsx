import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface props {
    condition: () => boolean;
    fallback: string;
    children: React.ReactNode;
}

export function ConditionalRoute({condition, fallback, children}: props) {
    const navigate = useNavigate();
    const [openRoute, setOpenRoute] = useState<boolean>(false);

    useEffect(() => {
        if (condition()) {
            navigate(fallback);
        } else {
            setOpenRoute(true);
        }
    }, []);

    return (
        <>{openRoute ? children : null}</>
    )
}