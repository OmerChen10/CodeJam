import { useContext, useState, createContext, useEffect } from "react"
import { toast } from "sonner";
import { useNetwork } from "./net-provider";
import { LocalStorageController } from "../controllers";
import { RouteConfig, UserInterface, UserResponse } from "../../config/constants";
import { useNavigate } from "react-router-dom";
import React from "react";
import { LoadingScreen } from "../components";

interface authProviderProps {
    user: UserInterface;
    createAccount: (password: string, email: string, username: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    withAuth: (callback: () => void) => void;
}

export const AuthContext = createContext<authProviderProps>(null!);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<UserInterface>(null!);
    const [loading, setLoading] = useState(true);
    const nm = useNetwork();
    const navigate = useNavigate();

    useEffect(() => {
        // Preform auto login
        if (!LocalStorageController.getUserToken()){
            setLoading(false);
            navigate(RouteConfig.LOGIN);
            return;
        }

        nm.send<UserResponse>("autoLogin", {token: LocalStorageController.getUserToken()})
            .then((response) => {
                if (response.success) {
                    setUser(response.data.user);
                }
                else {
                    // Invalid token
                    LocalStorageController.removeUserToken();
                    navigate(RouteConfig.LOGIN);
                }
                setLoading(false);
            })
    }, []);

    function createAccount(password: string, email: string, username: string) {
        // Send request to create account
        nm.send<UserResponse>("createUser", { password: password, email: email, username: username })
            .then((response) => {
                if (response.success) {
                    LocalStorageController.setUserToken(response.data.token);
                    setUser(response.data.user);
                    navigate(RouteConfig.HOME);
                    toast.success("Account created successfully!");
                }
                else {
                    toast.error("Username or email already exists!");
                }
            })
    }

    function login(email: string, password: string) {
        nm.send<UserResponse>("loginUser", { email: email, password: password })
            .then((response) => {
                if (response.success) {
                    LocalStorageController.setUserToken(response.data.token);
                    setUser(response.data.user);
                    navigate(RouteConfig.HOME);
                    toast.success("Logged in successfully!");
                }
                else {
                    toast.error("Invalid credentials!");
                }
            })
    }

    function isLoggedIn() {
        if (user != null) {
            return true;
        }
        return false;
    }

    function logout() {
        // Send request to logout
        LocalStorageController.clear();
        setUser(null!);
        navigate(RouteConfig.LOGIN);
    }

    function withAuth(callback: () => void) {
        // Execute the callback if the user is logged in
        if (isLoggedIn()) {
            callback();
        }
    }

    return (
        // Provide the auth context, and display a loading screen while the user is being authenticated
        <AuthContext.Provider value={{user, createAccount, login, logout, isLoggedIn, withAuth}}>
            {loading ? <LoadingScreen>Authenticating... </LoadingScreen> : children}
        </AuthContext.Provider>
    );
}