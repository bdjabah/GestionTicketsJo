// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    /**
     * Appelé après login : enregistre le token JWT, appelle le backend pour récupérer les infos utilisateur.
     */
    const login = async (jwtToken) => {
        localStorage.setItem("token", jwtToken);

        try {
            const res = await fetch('import.meta.env.VITE_API_URL/api/utilisateurs/me', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (res.ok) {
                const userData = await res.json();
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            logout();
        }
    };

    /**
     * Déconnecte l'utilisateur : nettoie le localStorage et le state.
     */
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);

    };

    /**
     * Vérifie si un token existe au chargement : recharge l'utilisateur automatiquement.
     */
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && !user) {
            login(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);