import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { usePanier } from "../context/PanierContext";
import { useEffect, useState } from "react";

// Initialise Stripe avec la clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Paiement() {
    const { panier } = usePanier();
    const [clientSecret, setClientSecret] = useState("");

    // Prix unitaire selon le type de ticket
    const prixParType = {
        solo: 45,
        duo: 45,
        famille: 45,
    };

    // Calcul du total de la commande (hors taxes)
    const total = panier.reduce((acc, t) => acc + (prixParType[t.type] || 0), 0);
    const taxes = total * 0.05;
    const totalAPayer = total + taxes;

    // On suppose que l'utilisateur est déjà connecté
    const utilisateurId = 1; // 🔁 À remplacer dynamiquement si nécessaire

    useEffect(() => {
        async function initPaiement() {
            try {
                // Étape 1 : Création de la commande
                const resCommande = await fetch(`${import.meta.env.VITE_API_URL}/api/commandes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        dateCommande: new Date().toISOString().split("T")[0],
                        totalCommande: totalAPayer,
                        idUtilisateur: utilisateurId,
                        tickets: [], // À compléter selon les données du panier
                    }),
                });

                const commande = await resCommande.json();
                const commandeId = commande.idCommande;

                // Étape 2 : Création du PaymentIntent avec Stripe
                const resPaiement = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-payment-intent`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: totalAPayer, commandeId }),
                });

                const data = await resPaiement.json();

                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    console.error("Aucun clientSecret reçu.");
                }
            } catch (err) {
                console.error("Erreur lors de l'initialisation du paiement :", err);
            }
        }

        initPaiement();
    }, [totalAPayer]);

    const appearance = { theme: "stripe" };
    const options = { clientSecret, appearance };

    return (
        <div className="min-h-screen bg-[#f4ede4] pt-32 px-8">
            <h2 className="text-3xl font-bold mb-6">Paiement</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Résumé de la commande */}
                <div className="bg-white p-6 border rounded shadow">
                    <h4 className="font-bold text-lg mb-3">Résumé de la commande</h4>
                    <p>Prix total : {total.toFixed(2)} €</p>
                    <p>Taxes : {taxes.toFixed(2)} €</p>
                    <p className="font-bold mt-2">Total à payer : {totalAPayer.toFixed(2)} €</p>
                </div>

                {/* Formulaire de paiement Stripe */}
                {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </div>
    );
}