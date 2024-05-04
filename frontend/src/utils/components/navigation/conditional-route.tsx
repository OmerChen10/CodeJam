import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { LocalStorageController } from "../../localStorageController";

interface props {
    condition: boolean;
    fallback: string;
    children: React.ReactNode;
}

export function ConditionalRoute({condition, fallback, children}: props) {
    const navigate = useNavigate();
    const [openRoute, setOpenRoute] = useState<boolean>(false);

    useEffect(() => {
        if (condition === false) {
            navigate(fallback);    
        }
        setOpenRoute(condition);
    }, []);

    return (
        <>{openRoute ? children : null}</>
    )
}