"use client";
import type { User } from "firebase/auth";
import { deleteUser, getIdToken, onAuthStateChanged, } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { useRouter } from "next/router";

export interface AuthContextInterface {
    user: User | null;
    logout: () => Promise<void>,
    getToken: () => Promise<string|null>
}

export const AuthContext = createContext<AuthContextInterface>({
    user: null,
    logout: async (): Promise<void> => { },
    getToken: async (): Promise<string | null> => {
        console.log("test");
        return null;
    }
})

const AuthContextProvider = ({ children } : {children:React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const checkIsTokenValid = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            }
        })
        return checkIsTokenValid;
    },[])

    const logout = async (): Promise<void> => {
        if (user) {
            return user.delete();
        } else {
            return;
        }
    };
    const getToken = async (): Promise<string | null> => {
        if (user) {
            return user.getIdToken();
        } else {
            return null;
        }
    };
    return (
        <AuthContext.Provider value={{ user, logout, getToken}}>
            {children}            
       </AuthContext.Provider>
   )
}

export default AuthContextProvider;

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        console.log("Context harus digunakan dibawah/didalam AuthContextProvider")
    }
    return context
}

