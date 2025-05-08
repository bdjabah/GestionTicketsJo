import { useState } from 'react';
import { useAuth } from '../context/useAuth.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import loginImage from '../assets/img-page-connexion.png';
import { FaGoogle, FaApple } from 'react-icons/fa';

export default function Connexion() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // 🔐 Appel réel au backend pour se connecter
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    motDePasse: password, // ← Doit correspondre au DTO backend
                }),
            });

            // ❌ Si la réponse n'est pas OK (401, 403, 500...)
            if (!res.ok) {
                const msg = await res.text();
                setError(msg || "Échec de la connexion.");
                return;
            }

            // ✅ Récupération du token depuis la réponse
            const data = await res.json();
            const token = data.token;

            if (!token) {
                setError("Token manquant dans la réponse.");
                return;
            }

            // ✅ Appelle le contexte Auth pour enregistrer le token et charger l'utilisateur
            await login(token);

            // ✅ On récupère l'URL de redirection s'il y en a une (ex: après tentative d'accès à /admin)
            const redirectTo = new URLSearchParams(location.search).get("redirect");

            // ✅ On récupère l'utilisateur depuis localStorage
            const user = JSON.parse(localStorage.getItem("user"));

            // 🔁 Redirections intelligentes selon le rôle
            if (redirectTo) {
                navigate(redirectTo); // → Reprend la route demandée initialement
            } else if (user?.role?.nomRole === 'ADMIN') {
                navigate('/admin'); // → Dashboard admin
            } else {
                navigate('/moncompte'); // → Compte utilisateur
            }

        } catch (err) {
            console.error(err);
            setError("Erreur lors de la tentative de connexion.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-130px)] grid grid-cols-1 md:grid-cols-2 bg-[#f4ede4] mt-16">
            {/* Image à gauche */}
            <div className="hidden md:block bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}></div>

            {/* Formulaire à droite */}
            <div className="relative flex flex-col justify-start items-center p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-2 w-10 px-3 h-10 rounded-full bg-[#d9c275] text-black text-lg flex items-center justify-center mr-auto"
                >
                    ←
                </button>

                <div className="w-full max-w-md mx-auto mt-2 bg-white p-6 rounded shadow-md">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 text-red-700 text-sm font-semibold mb-4 p-2 rounded text-center">
                                {error}
                            </div>
                        )}

                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            required
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            required
                        />
                        <button
                            type="submit"
                            className="w-1/2 mx-auto flex justify-center items-center bg-[#d9c275] text-white py-2 rounded hover:opacity-90 transition"
                        >
                            Je me connecte
                        </button>
                    </form>

                    <div className="w-full text-right mt-2">
                        <a href="/reset-password" className="text-sm text-blue-600 hover:underline">
                            Mot de passe oublié ?
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center w-full max-w-sm my-6">
                    <hr className="flex-grow border-black" />
                    <span className="px-4 text-lg">Ou se connecter avec</span>
                    <hr className="flex-grow border-black" />
                </div>

                {/* Social login (fake, évidemment) */}
                <div className="flex space-x-6 mb-6">
                    <FaGoogle className="text-3xl cursor-pointer hover:opacity-75" />
                    <FaApple className="text-3xl cursor-pointer hover:opacity-75" />
                </div>

                {/* Lien vers inscription */}
                <p className="mb-2">Nouveau client ?</p>
                <button
                    onClick={() => navigate('/inscription')}
                    className="bg-[#d9c275] text-white px-6 py-2 rounded hover:opacity-90"
                >
                    Je crée un nouveau compte
                </button>
            </div>
        </div>
    );
}
