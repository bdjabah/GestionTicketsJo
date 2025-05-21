// src/pages/CheckoutForm.jsx
import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

/**
 * Composant de formulaire de paiement Stripe.
 * Utilise Stripe Elements pour sécuriser les informations de carte.
 */
export default function CheckoutForm() {
    const stripe = useStripe();        // Instance Stripe
    const elements = useElements();    // Accès aux éléments Stripe (formulaire carte)

    const [loading, setLoading] = useState(false);   // État de chargement pendant le paiement
    const [message, setMessage] = useState("");      // Message d’erreur ou d’information

    /**
     * Soumission du formulaire de paiement
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // On s'assure que Stripe est bien chargé
        if (!stripe || !elements) return;

        setLoading(true);  // Active le mode "chargement"
        setMessage("");    // Réinitialise les messages précédents

        try {
            // Demande à Stripe de confirmer le paiement
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + "/ConfirmationPay", // Redirection après succès
                },
            });

            // En cas d’erreur (ex: carte refusée)
            if (error) {
                setMessage(error.message || "Une erreur est survenue.");
            }
        } catch (err) {
            setMessage("Erreur inattendue : " + err.message);
        }

        setLoading(false);  // Fin du chargement
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 border rounded shadow w-full max-w-md mx-auto">
            <h3 className="font-semibold mb-4 text-lg">Informations de paiement</h3>

            {/* Le formulaire Stripe (automatique, sécurisé) */}
            <PaymentElement />

            {/* Bouton de paiement */}
            <button
                type="submit"
                disabled={loading || !stripe || !elements}
                className={`mt-4 w-full py-2 rounded ${loading ? "bg-gray-400" : "bg-[#d9c275] text-white"}`}
            >
                {loading ? "Paiement en cours..." : "Payer maintenant"}
            </button>

            {/* Affichage des messages d’erreur ou d’info */}
            {message && <div className="text-red-500 mt-3">{message}</div>}
        </form>
    );
}
