import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx'; // ajuste selon ton chemin réel

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirection si l'utilisateur n'est pas admin
    useEffect(() => {
        if (!user || user.role.nomRole !== 'ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className=" mt-20 p-4">
            <h1 className="text-3xl font-bold mb-8">Espace Administrateur</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                    onClick={() => navigate('/admin/evenements')}
                    className="border border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition"
                >
                    Gestion Événements
                </button>
                <button
                    onClick={() => navigate('/admin/commandes')}
                    className="border border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition"
                >
                    Gestion Commandes
                </button>
                <button
                    onClick={() => navigate('/admin/tickets')}
                    className="border border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition"
                >
                    Gestion Produits
                </button>
            </div>
        </div>
    );
}