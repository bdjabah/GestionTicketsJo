import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TicketsList() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Erreur lors du chargement des billets');
                return res.json();
            })
            .then((data) => setTickets(data))
            .catch((err) => setError(err.message));
    }, [token]);

    const supprimerTicket = (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce billet ?')) return;

        fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Échec de la suppression');
                setTickets((prev) => prev.filter((t) => t.idTicket !== id));
            })
            .catch((err) => alert(err.message));
    };

    return (
        <div className="p-8 max-w-6xl mx-auto mt-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Liste des billets</h2>
                <button
                    onClick={() => navigate('/admin/tickets/new')}
                    className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition"
                >
                    Ajouter un billet
                </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="space-y-6">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.idTicket}
                        className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 border"
                    >
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{ticket.typeTicket}</h3>
                            <p><strong>Prix :</strong> {ticket.prixTicket}€</p>
                            <p><strong>Date :</strong> {ticket.dateEvenement}</p>
                            <p><strong>Statut :</strong> {ticket.statutTicket}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <button
                                onClick={() => navigate(`/admin/tickets/${ticket.idTicket}/edit`)}
                                className="hover:shadow-md text-white px-4 py-1 rounded"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => supprimerTicket(ticket.idTicket)}
                                className="hover:shadow-md text-white px-4 py-1 rounded"
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}