import { useEffect, useCallback, useState } from 'react';
import QRCode from 'react-qr-code';

export default function TicketsVendusList() {
    const [tickets, setTickets] = useState([]);
    const [statutFilter, setStatutFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [commandeFilter, setCommandeFilter] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const fetchTickets = useCallback((url) => {
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error('Erreur de chargement');
                return res.json();
            })
            .then(data => setTickets(data))
            .catch(err => setError(err.message));
    }, [token]);

    useEffect(() => {
        fetchTickets(`${import.meta.env.VITE_API_URL}/api/tickets-vendus`);
    }, [fetchTickets]);

    const applyFilters = () => {
        let url = `${import.meta.env.VITE_API_URL}/api/tickets-vendus`;
        if (statutFilter) url += `/statut/${statutFilter}`;
        else if (userFilter) url += `/utilisateur/${userFilter}`;
        else if (commandeFilter) url += `/commande/${commandeFilter}`;
        fetchTickets(url);
    };

    const supprimer = (id) => {
        if (!window.confirm('Supprimer ce ticket vendu ?')) return;
        fetch(`${import.meta.env.VITE_API_URL}/api/tickets-vendus/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Erreur suppression');
                setTickets(prev => prev.filter(t => t.idTicketVendu !== id));
            })
            .catch(err => alert(err.message));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-6">🎫 Tickets vendus (Admin)</h2>

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Filtrer par statut"
                    value={statutFilter}
                    onChange={e => setStatutFilter(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
                <input
                    type="text"
                    placeholder="Filtrer par ID utilisateur"
                    value={userFilter}
                    onChange={e => setUserFilter(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
                <input
                    type="text"
                    placeholder="Filtrer par ID commande"
                    value={commandeFilter}
                    onChange={e => setCommandeFilter(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
                <button
                    onClick={applyFilters}
                    className="bg-[#e0d2b9] px-4 py-2 rounded hover:bg-opacity-90"
                >
                    Appliquer
                </button>
                <button
                    onClick={() => {
                        setStatutFilter('');
                        setUserFilter('');
                        setCommandeFilter('');
                        fetchTickets(`${import.meta.env.VITE_API_URL}/api/tickets-vendus`);
                    }}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-opacity-90"
                >
                    Réinitialiser
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">ID</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3">Date achat</th>
                        <th className="p-3">QR Code</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(t => (
                        <tr key={t.idTicketVendu} className="border-b">
                            <td className="p-3">{t.idTicketVendu}</td>
                            <td className="p-3">{t.typeTicket}</td>
                            <td className="p-3">{t.statutTicket}</td>
                            <td className="p-3">{new Date(t.dateAchat).toLocaleString()}</td>
                            <td className="p-3"><QRCode value={t.qrCode} size={64} /></td>
                            <td className="p-3">
                                <button
                                    onClick={() => supprimer(t.idTicketVendu)}
                                    className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
