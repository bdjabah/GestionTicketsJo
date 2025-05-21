import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import loginImage from '../assets/img-page-connexion.png';
import { FaGoogle, FaApple } from 'react-icons/fa';

/**
 * Page de connexion utilisateur.
 * @component
 */
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const googleAuthUrl = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`

    /**
     * Soumet le formulaire de connexion.
     * Envoie les credentials au backend et stocke le token en cas de succès.
     * @param {React.FormEvent} e événement de soumission du formulaire
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, motDePasse: password }),
                }
            );

            if (!res.ok) {
                const msg = await res.text();
                setError(msg || 'Erreur lors de la connexion.');
                return;
            }

            const data = await res.json();
            await login(data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Erreur de réseau.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-130px)] grid grid-cols-1 md:grid-cols-2 bg-[#f4ede4] mt-16">
            {/** Colonne image (masquée en mobile) */}
            <div
                className="hidden md:block bg-cover bg-center"
                style={{ backgroundImage: `url(${loginImage})` }}
            />

            {/** Colonne formulaire */}
            <div className="flex flex-col items-center p-8">
                {/** Bouton retour */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-2 w-10 h-10 rounded-full bg-[#d9c275] text-black text-lg flex items-center justify-center self-start"
                >
                    ←
                </button>

                {/** Formulaire */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white p-8 rounded shadow-md"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Connexion
                    </h2>

                    {/** Affichage d’erreur si présent */}
                    {error && (
                        <div className="text-red-600 text-sm font-semibold mb-4">
                            {error}
                        </div>
                    )}

                    {/** Champ Email */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        required
                    />

                    {/** Champ Mot de passe avec toggle visibilité */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe
                    </label>
                    <div className="relative mb-6">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/** Lien mot de passe oublié */}
                    <div className="text-right mb-6">
                        <a
                            href="/reset-password"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Mot de passe oublié ?
                        </a>
                    </div>

                    {/** Bouton de soumission */}
                    <button
                        type="submit"
                        className="w-full bg-[#d9c275] text-white py-2 rounded hover:opacity-90 transition"
                    >
                        Je me connecte
                    </button>

                    {/** Séparateur pour authentification sociale */}
                    <div className="flex items-center w-full my-6">
                        <hr className="flex-grow border-black" />
                        <span className="px-4 text-lg">Ou se connecter avec</span>
                        <hr className="flex-grow border-black" />
                    </div>

                    {/** Boutons Google et Apple */}
                    <div className="flex justify-center space-x-6 mb-6 text-3xl text-gray-700">
                        <a href={googleAuthUrl} >
                            <FaGoogle className="cursor-pointer hover:opacity-75" />
                        </a>

                    </div>

                    {/** Lien vers la page d'inscription */}
                    <p className="text-center text-sm mb-0">
                        Nouveau client ?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/inscription')}
                            className="text-[#d9c275] hover:underline"
                        >
                            Créer un compte
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
