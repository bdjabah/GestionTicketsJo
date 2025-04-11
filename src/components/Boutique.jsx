import React from 'react';
import { useNavigate } from 'react-router-dom';
import solo from '../assets/img-ticket-solo.png';
import duo from '../assets/img-ticket-duo.png';
import famille from '../assets/img-ticket-famille.png';

// Tes offres de tickets
const offers = [
    {
        title: 'Jeux olympiques 2024',
        subtitle: 'Solo',
        price: '45,00€',
        image: solo,
    },
    {
        title: 'Jeux olympiques 2024',
        subtitle: 'Duo',
        price: '87,00€',
        image: duo,
    },
    {
        title: 'Jeux olympiques 2024',
        subtitle: 'Famille',
        price: '342,00€',
        image: famille,
    },
];

// Composant d'une seule carte
function Card({ title, subtitle, price, image }) {
    const navigate = useNavigate();

    const handleClick = () => {
        const type = subtitle.toLowerCase(); // solo, duo, famille
        navigate(`/ticket/${type}`);
    };

    return (
        <div className="bg-white rounded-md shadow-md p-4 flex flex-col items-center text-center">
            <img src={image} alt={subtitle} className="w-40 h-24 object-contain mb-2" />
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs text-gray-600 mb-2">{subtitle}</p>
            <p className="text-md font-semibold mb-2">{price}</p>
            <button
                onClick={handleClick}
                className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition"
            >
                Ajouter au panier
            </button>
        </div>
    );
}

// Composant principal de la page boutique
export default function OfferPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 pt-32">
            <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {offers.map((offer, index) => (
                    <Card key={index} {...offer} />
                ))}
            </div>
        </div>
    );
}
