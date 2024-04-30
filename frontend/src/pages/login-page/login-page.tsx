import { LocalStorageController } from "../../utils/localStorageController";
import { NetworkManager } from "../../network/manager";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { currentUser } from "../../App";
import { toast } from "sonner";
import React from "react";
import "./login.css"

export function LoginPage() {
    const [signup, setSignUp] = useState(false);
    const [user, setUser] = useContext(currentUser);
    const navigate = useNavigate();

    function createAccount() {
        let manager = NetworkManager.getInstance();
        // Get the email and password from the input fields
        let username = (document.getElementById("username") as HTMLInputElement).value;
        let email = (document.getElementById("email") as HTMLInputElement).value;
        let password = (document.getElementById("password") as HTMLInputElement).value;
        let confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
    
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        
        // Check if the email and password are valid
        if (email === "" || password === "") {
            toast.error("Invalid email or password");
            return;
        }
    
        manager = NetworkManager.getInstance();
        manager.send("createUser", {username: username, email: email, password: password}, (response: any) => {
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
        let manager = NetworkManager.getInstance();
        // Get the email and password from the input fields
        let email = (document.getElementById("email") as HTMLInputElement).value;
        let password = (document.getElementById("password") as HTMLInputElement).value;
    
        manager = NetworkManager.getInstance();
        manager.send("loginUser", {email: email, password: password}, (response: any) => {
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
                    <div className="input-group mb-3">
                        <input type="text" id="username" className="form-control" placeholder="Username:" aria-label="Username"/>
                    </div>
                    <div className="input-group mb-3">
                        <input type="email" id="email" className="form-control" placeholder="Email" aria-label="Email"/>
                    </div>
                    <div className="input-group mb-3">
                        <input type="password" id="password" className="form-control" placeholder="Password" aria-label="Password"/>
                    </div>
                    <div className="input-group mb-3">
                        <input type="password" id="confirm-password" className="form-control" placeholder="Confirm Password" aria-label="Password"/>
                    </div>
                    <div id="login-buttons">
                        <button onClick={createAccount} id="submit-button" className="btn btn-secondary grey">Create Account</button>
                        <h3 onClick={() => {setSignUp(false)}}>Back</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="main-login">
            <h1 id="login-title">CodeJam</h1>
            <div id="login-container">
                <div className="input-group mb-3">
                    <input type="email" id="email" className="form-control" placeholder="Email" aria-label="Email"/>
                </div>
                <div className="input-group mb-3">
                    <input type="password" id="password" className="form-control" placeholder="Password" aria-label="Password"/>
                </div>
                <div id="login-buttons">
                    <button onClick={login} id="submit-button" className="btn btn-secondary grey">Login</button>
                    <h3 onClick={() => {setSignUp(true)}}>Create Account</h3>
                </div>
            </div>
        </div>
    );
}
  