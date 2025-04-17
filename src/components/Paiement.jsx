// src/pages/Paiement.jsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { usePanier } from "../context/PanierContext";

const stripePromise = loadStripe("pk_test_51RDeAhRhNkRLZJCYZXKgDbG4Sw7bXY9r1P67xp5lkHToIm5Z9JDEcWhmhoSS44FBrkBtCuqWFjx61Gv5bpWGOZxu00RYQghZ1W"); // clé publique

export default function Paiement() {
    const { panier } = usePanier();

    const total = panier.length * 87;
    const taxes = total * 0.05;
    const totalAPayer = total + taxes;

    return (
        <div className="min-h-screen bg-[#f4ede4] pt-32 px-8">
            <h2 className="text-3xl font-bold mb-6">Paiement</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Résumé de commande */}
                <div className="bg-white p-6 border rounded shadow">
                    <h4 className="font-bold text-lg mb-3">Résumé de la commande</h4>
                    <p>Types de tickets : {new Set(panier.map(t => t.type)).size}</p>
                    <p>Prix total : {total.toFixed(2)} €</p>
                    <p>Taxes : {taxes.toFixed(2)} €</p>
                    <p className="font-bold mt-2">Total à payer : {totalAPayer.toFixed(2)} €</p>
                </div>

                {/* Paiement Stripe */}
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    );
}