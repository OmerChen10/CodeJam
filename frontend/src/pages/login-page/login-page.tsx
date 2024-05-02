import { LocalStorageController } from "../../utils/localStorageController";
import { NetworkManager } from "../../network/manager";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { currentUser } from "../../App";
import { toast } from "sonner";
import { TextField, Button } from "@mui/material";
import React from "react";
import "./login.css"

export function LoginPage() {
    const [signup, setSignUp] = useState(false);
    const [_, setUser] = useContext(currentUser);
    const nm = NetworkManager.getInstance();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    function createAccount() {

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Check if the email and password are valid
        if (email === "" || password === "") {
            toast.error("Invalid email or password");
            return;
        }

        nm.send("createUser", { username: username, email: email, password: password }, (response: any) => {
            if (response.success) {
                toast.success("Account created!");
                LocalStorageController.setUserToken(response.token);
                setUser(response.user)
                navigate("/home");
            }
            else {
                toast.error("Username already exists!");
            }
        });
    }

    function login() {
        nm.send("loginUser", { email: email, password: password }, (response: any) => {
            if (response.success) {
                setUser(response.user);
                toast.success("Logged in");
                LocalStorageController.setUserToken(response.token);
                navigate("/home");
            }
            else {
                toast.error("Invalid email or password");
            }
        });
    }

    if (signup) {
        return (
            <div id="main-login">
                <h1 id="login-title">CodeJam</h1>
                <div id="login-container">
                    <TextField required  id="username" label="Username" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} />
                    <TextField required id="email" label="Email" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField required id="password" label="Password" variant="outlined" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <TextField required id="confirm-password" label="Confirm Password" variant="outlined" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <div id="login-buttons">
                        <Button variant="contained" color="secondary" onClick={createAccount}>Create Account</Button>
                        <h3 onClick={() => { setSignUp(false) }}>Back</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="main-login">
            <h1 id="login-title">CodeJam</h1>
            <div id="login-container">
                <TextField required id="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <TextField required id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <div id="login-buttons">
                    <Button variant="contained" color="secondary" onClick={login}>Login</Button>
                    <h3 onClick={() => { setSignUp(true) }}>Create Account</h3>
                </div>
            </div>
        </div>
    );
}
