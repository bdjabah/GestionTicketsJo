import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { usePanier } from "../context/PanierContext";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Paiement() {
    const { panier } = usePanier();
    const [clientSecret, setClientSecret] = useState("");
    const [commandeId, setCommandeId] = useState(null);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const prixParType = {
        solo: 45,
        duo: 40,
        famille: 35,
    };

    const total = panier.reduce((acc, t) => acc + (prixParType[t.type] || 0), 0);
    const taxes = total * 0.05;
    const totalAPayer = total + taxes;
    const tickets = panier.map((t) => ({
        nom: t.nom,
        prenom: t.prenom,
        email: t.email,
        telephone: t.telephone,
        type: t.type,
        ticketCatalogueId: t.ticketCatalogue?.idTicket || t.ticketCatalogueId,
        quantite: t.quantite || 1,
    }));

    useEffect(() => {
        if (!token) {
            setError("Vous devez être connecté pour procéder au paiement.");
            return;
        }

        const initPaiement = async () => {
            try {
                // 1. Créer la commande
                const commandeRes = await fetch(`${import.meta.env.VITE_API_URL}/api/commandes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        dateCommande: new Date().toISOString().split("T")[0],
                        totalCommande: totalAPayer,
                        statut: "EN_ATTENTE",
                        idUtilisateur: user?.idUtilisateur,
                        tickets,
                    }),
                });

                if (!commandeRes.ok) throw new Error(await commandeRes.text());
                const commande = await commandeRes.json();
                setCommandeId(commande.idCommande);

                // 2. Créer le paiement Stripe
                const paiementRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-payment-intent`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ amount: totalAPayer, commandeId: commande.idCommande }),
                });

                if (!paiementRes.ok) throw new Error(await paiementRes.text());
                const data = await paiementRes.json();

                // 4. Enfin, afficher le formulaire Stripe
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        initPaiement();
    }, []); // ⛔ On ne relance pas à chaque changement de panier

    const appearance = { theme: "stripe" };
    const options = { clientSecret, appearance };

    return (
        <div className="min-h-screen bg-[#f4ede4] pt-32 px-8">
            <h2 className="text-3xl font-bold mb-6">Paiement</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 border rounded shadow">
                    <h4 className="font-bold text-lg mb-3">Résumé de la commande</h4>
                    <p>Prix total : {total.toFixed(2)} €</p>
                    <p>Taxes : {taxes.toFixed(2)} €</p>
                    <p className="font-bold mt-2">Total à payer : {totalAPayer.toFixed(2)} €</p>
                </div>

                {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm commandeId={commandeId} />
                    </Elements>
                )}
            </div>
        </div>
    );
}
