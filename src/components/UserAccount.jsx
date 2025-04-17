import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserAccount() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Si pas connecté, on redirige gentiment vers /connexion
    if (!user) {
        return (
            <div className="p-8 text-center">
                <p className="text-lg font-semibold text-red-700">
                    Vous devez être connecté pour voir cette page.
                </p>
                <button
                    onClick={() => navigate("/connexion?redirect=/moncompte")}
                    className="mt-4 bg-[#d9c275] text-white px-6 py-2 rounded hover:opacity-90"
                >
                    Se connecter
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-xl mx-auto bg-white rounded shadow mt-20">
            <h2 className="text-2xl font-bold mb-4">👤 Mon compte</h2>

            <p className="mb-2"><strong>Email :</strong> {user.email}</p>

            {user.clefUtilisateur && (
                <p className="mb-2 break-words text-sm text-gray-500">
                    <strong>Clé utilisateur :</strong> {user.clefUtilisateur}
                </p>
            )}

            <button
                onClick={() => {
                    logout();
                    navigate("/");
                }}
                className="mt-6 bg-red-100 text-red-800 px-6 py-2 rounded hover:bg-red-200"
            >
                Se déconnecter
            </button>
        </div>
    );
}
