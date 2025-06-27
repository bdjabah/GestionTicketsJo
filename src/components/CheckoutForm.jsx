import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ commandeId }) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setMessage("");

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + "/ConfirmationPay",
                },
            });

            if (error) {
                setMessage(error.message || "Une erreur est survenue.");
            } else {
                // ✅ Mise à jour du statut après paiement réussi
                if (commandeId) {
                    try {
                        await fetch(`${import.meta.env.VITE_API_URL}/api/commandes/${commandeId}/status`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: JSON.stringify("PAYEE"),
                        });
                        console.log("Statut mis à jour à PAYEE");
                    } catch (err) {
                        console.error("Erreur mise à jour statut :", err.message);
                    }
                }
            }
        } catch (err) {
            setMessage("Erreur inattendue : " + err.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 border rounded shadow w-full max-w-md mx-auto">
            <h3 className="font-semibold mb-4 text-lg">Informations de paiement</h3>

            <PaymentElement />

            <button
                type="submit"
                disabled={loading || !stripe || !elements}
                className={`mt-4 w-full py-2 rounded ${loading ? "bg-gray-400" : "bg-[#d9c275] text-white"}`}
            >
                {loading ? "Paiement en cours..." : "Payer maintenant"}
            </button>

            {message && <div className="text-red-500 mt-3">{message}</div>}
        </form>
    );
}