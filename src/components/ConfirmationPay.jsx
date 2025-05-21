import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Page de confirmation après un paiement réussi.
 * Affiche un message de succès et propose un retour à l'accueil.
 */
export default function ConfirmationPay() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#f5ede2] text-center px-4">
            <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold text-[#d9c275] mb-4">Paiement confirmé 🎉</h1>
                <p className="text-gray-700 mb-6">
                    Merci pour votre achat ! Votre transaction a bien été enregistrée.
                </p>

                <Link
                    to="/"
                    className="inline-block bg-[#d9c275] text-white px-6 py-2 rounded hover:bg-[#bfa85f] transition-colors"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
