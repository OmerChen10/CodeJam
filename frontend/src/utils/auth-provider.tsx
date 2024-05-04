import { useContext, useState, createContext, useEffect } from "react"
import { toast } from "sonner";
import { useNetwork } from "./net-provider";
import { LocalStorageController } from "./localStorageController";
import { RouteConfig, UserInterface, UserResponse } from "../config/constants";
import { Navigate, useNavigate } from "react-router-dom";
import React from "react";
import { LoadingScreen } from "../utils/components";

interface authProviderProps {
    user: UserInterface;
    createAccount: (password: string, email: string, username: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
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
                    LocalStorageController.removeUserToken();
                    navigate(RouteConfig.LOGIN);
                }
                setLoading(false);
            })
    }, []);

    function createAccount(password: string, email: string, username: string) {
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
                    console.log(response.data);
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
        LocalStorageController.removeUserToken();
        setUser(null!);
        navigate("/");
    }

    return (
        <AuthContext.Provider value={{user, createAccount, login, logout, isLoggedIn}}>
            {loading ? <LoadingScreen>Authenticating... </LoadingScreen> : children}
        </AuthContext.Provider>
    );
}