import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { usePanier } from "../context/PanierContext";
import { useEffect, useState } from "react";

// Clé publique Stripe
const stripePromise = loadStripe("pk_test_xxxxxxxxxxxxxx");

export default function Paiement() {
    const { panier } = usePanier();
    const [clientSecret, setClientSecret] = useState("");

    // Prix par type de ticket
    const prixParType = {
        solo: 45,
        duo: 87,
        famille: 342,
    };

    // Calcul du total
    const total = panier.reduce((acc, t) => acc + (prixParType[t.type] || 0), 0);
    const taxes = total * 0.05;
    const totalAPayer = total + taxes;

    // Quand la page se charge, on crée le paiement côté Stripe
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: totalAPayer }),
        })
            .then(async (res) => {
                const text = await res.text();               // On lit la réponse comme texte
                return text ? JSON.parse(text) : {};         // On parse uniquement si non vide
            })
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);      // On garde le clientSecret pour Stripe
                } else {
                    console.error("Aucun clientSecret reçu.");
                }
            })
            .catch((err) => {
                console.error("Erreur lors de la création du paiement Stripe :", err);
            });
    }, [totalAPayer]);

    const appearance = { theme: "stripe" };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-[#f4ede4] pt-32 px-8">
            <h2 className="text-3xl font-bold mb-6">Paiement</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Bloc résumé commande */}
                <div className="bg-white p-6 border rounded shadow">
                    <h4 className="font-bold text-lg mb-3">Résumé de la commande</h4>
                    <p>Prix total : {total.toFixed(2)} €</p>
                    <p>Taxes : {taxes.toFixed(2)} €</p>
                    <p className="font-bold mt-2">Total à payer : {totalAPayer.toFixed(2)} €</p>
                </div>

                {/* Bloc formulaire Stripe */}
                {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </div>
    );
}
