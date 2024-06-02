import { useEffect, useRef, useState } from "react";
import { TextField, Button } from "@mui/material";
import React from "react";
import "./login.css"
import { useAuth } from "../../utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RouteConfig } from "../../config/constants";
import { EmailVerificationDialog } from "../../utils/components/dialogs/email-verification-dialog";

export function LoginPage() {
    const [signup, setSignUp] = useState(false);
    const [emailVerificationOpen, setEmailVerificationOpen] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const emailRef = useRef("");
    
    useEffect(() => {
        if (auth.isLoggedIn()) {
            navigate(RouteConfig.HOME);
        }
    }, []);

    function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get("email") as string;
        emailRef.current = email;
        const password = data.get("password") as string;
        auth.login(email, password).then((success) => {
            if (success) {
                setEmailVerificationOpen(true);
            }
        });
    }

    function createAccount(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get("email") as string;
        emailRef.current = email;
        const password = data.get("password") as string;
        const confirmPassword = data.get("confirm-password") as string;
        const username = data.get("username") as string;
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        auth.createAccount(password, email, username).then((success) => {
            if (success) {
                setEmailVerificationOpen(true);
            }
        });
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
            <EmailVerificationDialog open={emailVerificationOpen} setOpen={setEmailVerificationOpen} email={emailRef.current}/>
        </div>
    );
}
