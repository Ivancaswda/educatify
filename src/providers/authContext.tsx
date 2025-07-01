'use client';

import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import {getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth";
import {app} from '../lib/firebaseConfig'

type User = {
    id: string;
    name: string;
    userId: string;
    email: string;
    image?: string;
    user_id: string
    role: "student" | "mentor";
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("token");

        if (stored) {
            console.log("📦 Токен из localStorage:", stored); // <-- добавь это
            try {
                const decoded = jwtDecode<User>(stored);
                setToken(stored);
                setUser(decoded);
            } catch (e) {
                console.error("Ошибка декодирования JWT:", e);
                setToken(null);
                localStorage.removeItem("token");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        const decoded = jwtDecode<User>(newToken);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };
    const signInWithGoogle = async () => {
        setIsLoading(true);
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseToken = await result.user.getIdToken();

           // login(firebaseToken); // сохраняем токен и юзера
            return {
                token: firebaseToken,
                user: result.user,
            };
        } catch (error) {
            console.error("Ошибка при входе через Google:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const signInWithGitHub = async () => {
        const auth = getAuth(app);
        const provider = new GithubAuthProvider();

        const result = await signInWithPopup(auth, provider);
        const firebaseToken = await result.user.getIdToken();
        console.log(result)
        console.log(firebaseToken)
        return {
            token: firebaseToken,
            user: result.user,
        };
    };


    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, signInWithGoogle, signInWithGitHub }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
