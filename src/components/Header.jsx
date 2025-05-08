import { useState } from 'react';
import {
    HomeIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    UserCircleIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // ← ajout ici
import logo from '../assets/logo-jo.png';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAuth(); // ← récupération de l'utilisateur

    // ⬇️ On adapte les liens selon l'état de connexion
    const navItems = [
        { label: 'Accueil', icon: <HomeIcon className="w-5 h-5" />, to: '/' },
        { label: 'Boutique', icon: <ShoppingBagIcon className="w-5 h-5" />, to: '/boutique' },
        { label: 'Panier', icon: <ShoppingCartIcon className="w-5 h-5" />, to: '/panier' },
        user
            ? { label: 'Mon compte', icon: <UserCircleIcon className="w-5 h-5" />, to: '/moncompte' }
            : { label: 'Connexion', icon: <UserCircleIcon className="w-5 h-5" />, to: '/connexion' },
    ];

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="w-full px-6 py-2 flex items-center justify-between">
                {/* Logo à gauche */}
                <Link to="/" className="flex items-center gap-4 flex-shrink-0">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-300">
                        <img
                            src={logo}
                            alt="Logo JO"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="text-lg font-bold text-gray-800">JO 2024</span>
                </Link>

                {/* Menu desktop */}
                <nav className="hidden md:flex gap-8 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="flex items-center gap-2 text-black hover:text-gray-700 transition"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bouton burger mobile */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden focus:outline-none"
                >
                    <svg
                        className="w-6 h-6 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Menu mobile */}
            {menuOpen && (
                <div className="md:hidden bg-white px-6 pb-4 flex flex-col gap-4 text-sm font-medium text-black shadow">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 hover:text-gray-700 transition"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
