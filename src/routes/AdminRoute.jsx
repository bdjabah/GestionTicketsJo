import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

export default function AdminRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirection vers login avec le chemin original à revenir
        return <Navigate to={`/connexion?redirect=${location.pathname}`} replace />;
    }

    if (user.role.nomRole !== 'ADMIN') {
        // Message si l'utilisateur n'est pas admin
        return <div className="p-8 text-red-600 font-bold text-center">Accès non autorisé</div>;
    }

    return children;
}