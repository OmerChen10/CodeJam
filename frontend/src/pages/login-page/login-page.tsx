import { useEffect, useState } from "react";
import { TextField, Button, Box, Container } from "@mui/material";
import React from "react";
import "./login.css"
import { useAuth } from "../../utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RouteConfig } from "../../config/constants";

export function LoginPage() {
    const [signup, setSignUp] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (auth.isLoggedIn()) {
            navigate(RouteConfig.HOME);
        }
    }, []);

    function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        auth.login(email, password);
    }

    function createAccount(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        const confirmPassword = data.get("confirm-password") as string;
        const username = data.get("username") as string;
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        auth.createAccount(password, email, username);
    }

    function renderForm() {
        if (signup) {
            return (
                <form onSubmit={createAccount} className="login-form">
                    <TextField required name="username" label="Username" variant="outlined" />
                    <TextField required name="email" label="Email" variant="outlined" />
                    <TextField required name="password" label="Password" variant="outlined" type="password" />
                    <TextField required name="confirm-password" label="Confirm Password" variant="outlined" type="password" />
                    <div id="login-buttons">
                        <Button variant="contained" color="secondary" type="submit">Create Account</Button>
                        <h3 onClick={() => { setSignUp(false) }}>Back</h3>
                    </div>
                </form>
            );
        }

        return (
            <form onSubmit={login} className="login-form">
                <TextField required name="email" label="Email" />
                <TextField required name="password" label="Password" type="password" />
                <div id="login-buttons">
                    <Button variant="contained" color="secondary" type="submit">Login</Button>
                    <h3 onClick={() => { setSignUp(true) }}>Create Account</h3>
                </div>
            </form>
        );
    }


    return (
        <div id="main-login">
            <h1 id="login-title">CodeJam</h1>
            <div id="login-container">
                {renderForm()}
            </div>
        </div>
    );
}
