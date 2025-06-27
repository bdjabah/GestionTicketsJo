import { useAuth } from '../context/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export default function UserAccount() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Redirection si l'utilisateur n'est pas connecté
    useEffect(() => {
        if (!user) return;
        fetch(`${import.meta.env.VITE_API_URL}/api/tickets-vendus/utilisateur/${user.idUtilisateur}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Impossible de charger vos billets');
                return res.json();
            })
            .then(data => setTickets(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <div className="p-8 text-center">
                <p className="text-lg font-semibold text-red-700">
                    Vous devez être connecté pour voir cette page.
                </p>
                <button
                    onClick={() => navigate('/connexion?redirect=/moncompte')}
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
                <h3 className="text-xl font-bold mb-4">🧾 Mes billets achetés</h3>

                {loading && <p className="text-gray-500">Chargement...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {!loading && tickets.length === 0 && (
                    <p className="text-gray-500">Aucun billet acheté pour le moment.</p>
                )}

                {!loading && tickets.length > 0 && (
                    <ul className="space-y-6">
                        {tickets.map(ticket => (
                            <li key={ticket.idTicketVendu} className="border p-4 rounded shadow-sm">
                                <p><strong>Type :</strong> {ticket.typeTicket}</p>
                                <p><strong>Date d'achat :</strong> {new Date(ticket.dateAchat).toLocaleString()}</p>
                                <p><strong>Statut :</strong> {ticket.statutTicket}</p>
                                <div className="mt-4 flex justify-center">
                                    <QRCode value={ticket.qrCode} size={128} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={() => { logout(); navigate('/'); }}
                className="mt-6 bg-[#d9c275] px-6 py-2 rounded hover:bg-red-200"
            >
                Se déconnecter
            </button>
        </div>
    );
}
