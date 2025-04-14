// src/components/CheckoutForm.jsx
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        // Simulation sans backend — à remplacer avec ton backend Stripe
        setTimeout(() => {
            setLoading(false);
            navigate("/confirmation");
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 border rounded shadow w-full">
            <h3 className="font-semibold mb-4">Informations de paiement</h3>
            <CardElement className="border p-3 rounded mb-4" />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="bg-[#d9c275] text-white w-full py-2 rounded hover:opacity-90 disabled:opacity-60"
            >
                {loading ? "Traitement..." : "Payer maintenant"}
            </button>
        </form>
    );
}
