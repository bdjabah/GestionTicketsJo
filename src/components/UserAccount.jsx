import { useAuth } from '../context/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

export default function UserAccount() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Vérifier les achats stockés localement
    const achats = JSON.parse(localStorage.getItem("achats")) || [];
    const mesAchats = achats.filter(a => a.email === user?.email);

    // Redirection si l'utilisateur n'est pas connecté
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



            <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">🧾 Historique des billets</h3>
                {mesAchats.length === 0 ? (
                    <p className="text-gray-500">Aucun billet acheté pour le moment.</p>
                ) : (
                    <ul className="text-sm text-gray-800 space-y-4">
                        {mesAchats.map((achat, index) => (
                            <li key={index} className="border p-4 rounded shadow-sm">
                                <p><strong>Date :</strong> {new Date(achat.date).toLocaleString()}</p>
                                <p className="break-all"><strong>Clé billet :</strong> {achat.qr}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                onClick={() => {
                    logout();
                    navigate("/");
                }}
                className="mt-6 bg-[#d9c275] px-6 py-2 rounded hover:bg-red-200"
            >
                Se déconnecter
            </button>
        </div>
    );
}
