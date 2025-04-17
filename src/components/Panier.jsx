import { usePanier } from '../context/PanierContext';
import { useTicketEdit } from '../context/TicketEditContext';
import { useNavigate } from 'react-router-dom';

export default function Panier() {
    const { panier, resetPanier, removeFromPanier } = usePanier();
    const { setTicketToEdit, setEditIndex } = useTicketEdit();
    const navigate = useNavigate(); // 🔁 position corrigée ici

    const groupedTickets = panier.reduce((acc, ticket) => {
        if (!acc[ticket.type]) acc[ticket.type] = [];
        acc[ticket.type].push(ticket);
        return acc;
    }, {});

    // ✅ CHANGEMENT ICI : ajout du paramètre redirect
    const handleLogin = () => {
        navigate("/connexion?redirect=/paiement");
    };

    const typeLabels = {
        solo: 'Tickets Solo',
        duo: 'Tickets Duo',
        famille: 'Tickets Famille',
    };

    const prixParType = {
        solo: 45,
        duo: 87,
        famille: 342,
    };

    const prixTotal = panier.reduce((acc, ticket) => {
        return acc + (prixParType[ticket.type] || 0);
    }, 0);

    const taxes = prixTotal * 0.05;
    const totalAPayer = prixTotal + taxes;

    return (
        <div className="min-h-[calc(100vh-200px)] px-24 pt-16 mt-4">
            <h2 className="text-4xl font-bold mb-10 text-center">🛒 Votre panier</h2>

            {panier.length === 0 ? (
                <div className="text-center text-lg text-gray-700">
                    Vous n’avez pas encore ajouté d’article à votre panier.
                    <div className="mt-4">
                        <a
                            href="/boutique"
                            className="text-[#d9c275] underline hover:text-[#bda963] transition"
                        >
                            Retour à la boutique
                        </a>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Bloc Tickets (3 colonnes sur 5) */}
                    <div className="md:col-span-3">
                        {Object.entries(groupedTickets).map(([type, tickets], groupIndex) => (
                            <div
                                key={groupIndex}
                                className="mb-10 bg-white rounded-lg shadow-md p-6 border border-gray-300"
                            >
                                <h3 className="text-2xl font-semibold mb-4">
                                    {typeLabels[type] || type} ({tickets.length})
                                </h3>

                                <div className="flex flex-wrap justify-center gap-6 mt-4">
                                    {tickets.map((ticket, idx) => {
                                        const globalIndex = panier.findIndex(
                                            (t) =>
                                                t.nom === ticket.nom &&
                                                t.prenom === ticket.prenom &&
                                                t.email === ticket.email &&
                                                t.telephone === ticket.telephone &&
                                                t.type === ticket.type
                                        );

                                        return (
                                            <div
                                                key={idx}
                                                className="w-64 bg-white p-4 rounded shadow text-sm border border-gray-300 relative"
                                            >
                                                <button
                                                    onClick={() => removeFromPanier(globalIndex)}
                                                    className="absolute top-2 right-2 text-red-600 text-sm hover:text-red-800"
                                                    title="Supprimer ce ticket"
                                                >
                                                    ❌
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setTicketToEdit(ticket);
                                                        setEditIndex(globalIndex);
                                                        navigate(`/ticket/${ticket.type}/edit`);
                                                    }}
                                                    className="absolute bottom-2 right-2 text-blue-600 text-sm hover:text-blue-800"
                                                    title="Modifier ce ticket"
                                                >
                                                    ✏️
                                                </button>

                                                <p className="font-bold">
                                                    {ticket.civilite} {ticket.prenom} {ticket.nom}
                                                </p>
                                                <p className="text-xs text-gray-700">📧 {ticket.email}</p>
                                                <p className="text-xs text-gray-700">📱 {ticket.telephone}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bloc Résumé de commande (2 colonnes sur 5) */}
                    <div className="md:col-span-2">
                        <div className="w-full bg-white shadow-md p-6 rounded-md text-sm border border-black">
                            <h3 className="text-lg font-bold mb-4">🧾 Résumé de la commande</h3>

                            <div className="mb-2 flex justify-between">
                                <span>Types de tickets</span>
                                <span>{Object.keys(groupedTickets).length}</span>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <span>Prix total</span>
                                <span>{prixTotal.toFixed(2)} €</span>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <span>Taxes (5%)</span>
                                <span>{taxes.toFixed(2)} €</span>
                            </div>
                            <hr className="my-3" />
                            <div className="font-bold flex justify-between text-md">
                                <span>Total à payer</span>
                                <span>{totalAPayer.toFixed(2)} €</span>
                            </div>

                            {/* ✅ Bouton mis à jour ici */}
                            <button onClick={handleLogin} className="mt-6 w-full bg-[#d9c275] text-white py-2 rounded hover:opacity-90 transition">
                                Procéder au paiement
                            </button>

                            <button
                                onClick={resetPanier}
                                className="mt-4 w-full bg-red-100 text-red-800 py-2 rounded hover:bg-red-200 transition"
                            >
                                🗑️ Vider le panier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
