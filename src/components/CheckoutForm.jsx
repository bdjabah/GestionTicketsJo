import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from '../context/useAuth.jsx';
import { QRCodeCanvas } from "qrcode.react";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [qrKey, setQrKey] = useState(null);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        setTimeout(() => {
            const billetKey = uuidv4();
            const finalKey = user.clefUtilisateur + billetKey;
            setQrKey(finalKey);
            setLoading(false);
            setDone(true);

            // ✅ Stocker l'achat dans le localStorage
            const previousPurchases = JSON.parse(localStorage.getItem("achats")) || [];
            const newPurchase = {
                email: user.email,
                date: new Date().toISOString(),
                qr: finalKey,
            };
            localStorage.setItem("achats", JSON.stringify([...previousPurchases, newPurchase]));
        }, 2000);
    };

    if (done && qrKey) {
        return (
            <div className="bg-white p-6 border rounded shadow w-full text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-4">✅ Paiement confirmé !</h3>
                <p className="text-sm mb-2">Voici votre billet numérique :</p>
                <QRCodeCanvas value={qrKey} size={256} />
                <p className="mt-4 text-xs text-gray-600 break-all">{qrKey}</p>
            </div>
        );
    }

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
