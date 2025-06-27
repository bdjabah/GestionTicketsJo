import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ ticket }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-md shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition">
            {ticket.image ? (
                <img
                    src={ticket.image}
                    alt={`Image du billet ${ticket.type}`}
                    className="w-40 h-24 object-contain mb-2"
                />
            ) : (
                <div className="w-40 h-24 flex items-center justify-center bg-gray-100 mb-2 text-gray-400 text-sm rounded">
                    Pas d'image
                </div>
            )}
            <h3 className="text-sm font-semibold">Jeux olympiques 2024</h3>
            <p className="text-xs text-gray-600 mb-2">{ticket.type}</p>
            <p className="text-md font-semibold mb-2">{ticket.prix.toFixed(2)} €</p>
            <button
                onClick={() => navigate(`/ticket/${ticket.type.toLowerCase()}`)}
                className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition"
            >
                Ajouter au panier
            </button>
        </div>
    );
}

export default function Boutique() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
        if (!API) {
            console.error('❌ VITE_API_URL non défini');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');

        fetch(`${API}/api/tickets`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                return res.json();
            })
            .then((raw) => {
                const filtered = raw
                    .filter((t) => t.statutTicket === 'DISPONIBLE')
                    .map((t) => {
                        const imageName = t.imageTicket
                            ?.replace(/^https?:\/\/[^/]+\/uploads\/+/i, '')
                            ?.replace(/^\/?uploads\/+/, '');

                        return {
                            id: t.idTicket,
                            type: t.typeTicket,
                            prix: parseFloat(t.prixTicket),
                            stock: t.stock,
                            statut: t.statutTicket,
                            image: imageName ? `${API}/uploads/${imageName}` : null,
                        };
                    });

                setTickets(filtered.sort((a, b) => a.prix - b.prix));
            })
            .catch((err) => console.error('Erreur chargement billets :', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 pt-32">
            {loading ? (
                <p className="text-gray-500">Chargement des billets...</p>
            ) : tickets.length === 0 ? (
                <p className="text-gray-400">Aucun billet disponible.</p>
            ) : (
                <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {tickets.map((ticket) => (
                        <Card key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
}