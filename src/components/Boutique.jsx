// src/pages/Boutique.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ ticket }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-md shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition">
            {ticket.image && (
                <img
                    src={ticket.image}
                    alt={ticket.type}
                    className="w-40 h-24 object-contain mb-2"
                />
            )}
            <h3 className="text-sm font-semibold">Jeux olympiques 2024</h3>
            <p className="text-xs text-gray-600 mb-2">{ticket.type}</p>
            <p className="text-md font-semibold mb-2">
                {ticket.prix.toFixed(2)} €
            </p>
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

    useEffect(() => {
        const raw = JSON.parse(localStorage.getItem('boutiqueTickets')) || [];

        const cleaned = raw.map(t => {
            // Supprime tous les préfixes inutiles
            const imageName = t.image
                ?.replace(/^https?:\/\/[^/]+\/uploads\/+/i, '') // supprime "http://.../uploads/"
                ?.replace(/^\/?uploads\/+/, '');                // supprime "/uploads/"

            return {
                ...t,
                prix: parseFloat(t.prix),
                image: imageName ? `${import.meta.env.VITE_API_URL}/uploads/${imageName}` : null,
            };
        });

        const sorted = cleaned.sort((a, b) => a.prix - b.prix);
        setTickets(sorted);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 pt-32">
            <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {tickets.map((ticket, index) => (
                    <Card key={index} ticket={ticket} />
                ))}
            </div>
        </div>
    );
}
