// src/pages/CheckoutForm.jsx

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
    const stripe = useStripe();        // Objet Stripe
    const elements = useElements();    // Récupère le formulaire Stripe
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Quand l'utilisateur clique sur "Payer maintenant"
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return; // On attend que Stripe soit prêt

        setLoading(true); // On bloque le bouton pendant le traitement

        // Stripe confirme le paiement avec les infos du formulaire
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/confirmation", // Redirection après paiement
            },
        });

        // S’il y a une erreur (ex: carte refusée)
        if (error) {
            setMessage(error.message); // Affiche le message d'erreur
        }

        setLoading(false); // Réactive le bouton
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 border rounded shadow w-full">
            <h3 className="font-semibold mb-4">Informations de paiement</h3>

            {/* Formulaire intelligent fourni par Stripe */}
            <PaymentElement />

            <button
                disabled={loading || !stripe || !elements}
                className="mt-4 bg-[#d9c275] text-white w-full py-2 rounded"
            >
                {loading ? "Paiement en cours..." : "Payer maintenant"}
            </button>

            {/* Affiche un message d’erreur si besoin */}
            {message && <div className="text-red-500 mt-2">{message}</div>}
        </form>
    );
}
