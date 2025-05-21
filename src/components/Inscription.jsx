import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Icônes pour afficher/masquer le mot de passe
import inscriptionBg from '../assets/img-inscription.jpg';
import { useAuth } from '../context/useAuth.jsx';

export default function Inscription() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Données du formulaire
    const [formData, setFormData] = useState({
        civilite: '',
        prenom: '',
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
        telephone: '',
        adresse: '',
    });

    // États pour gérer les erreurs, indices, et affichage des mots de passe
    const [error, setError] = useState('');
    const [passwordHint, setPasswordHint] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Gestion des changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Vérification du mot de passe en direct
        if (name === 'password') {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
            setPasswordHint(regex.test(value) ? '' : 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre.');
        }
    };

    // Soumission du formulaire d'inscription
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { civilite, prenom, nom, email, password, confirmPassword, telephone, adresse } = formData;

        // Vérifie que tous les champs sont remplis
        if (!civilite || !prenom || !nom || !email || !password || !confirmPassword || !telephone || !adresse) {
            setError('Tous les champs sont obligatoires.');
            return;
        }

        // Validation du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(password)) {
            setError('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        // Envoie les données au backend pour inscription
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nom, prenom, email, motDePasse: password, telephone, civilite, adresse })
            });

            if (!res.ok) {
                const message = await res.text();
                setError(message || "Erreur lors de l'inscription.");
                return;
            }

            // Connexion automatique après inscription réussie
            const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, motDePasse: password })
            });

            if (!loginRes.ok) {
                setError("Inscription réussie, mais erreur lors de la connexion.");
                return;
            }

            const loginData = await loginRes.json();
            await login(loginData.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'inscription.");
        }
    };

    return (
        <div className="flex flex-1 min-h-[calc(100vh-130px)] mt-16">
            {/* Image à gauche (pour écran md et plus) */}
            <div className="hidden md:block w-1/2">
                <img src={inscriptionBg} alt="Inscription" className="w-full h-full object-cover" />
            </div>

            {/* Formulaire à droite */}
            <div className="w-full md:w-1/2 bg-[#f4ede4] h-full flex items-center justify-center px-8 py-10">
                <button onClick={() => navigate(-1)} type="button"
                    className="mb-4 w-10 px-3 h-10 rounded-full bg-[#d9c275] text-black text-lg flex items-center justify-center mr-auto">
                    ←
                </button>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
                    {/* Message d'erreur global */}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Instructions */}
                    <p className="text-sm text-gray-600 mb-4">
                        <strong>Tous les champs sont obligatoires</strong>. Veuillez remplir le formulaire avec des informations valides.
                    </p>

                    {/* Civilité */}
                    <div className="flex gap-4 mb-2">
                        <label className="flex items-center">
                            <input type="radio" name="civilite" value="Mme" checked={formData.civilite === 'Mme'} onChange={handleChange} className="mr-1" />
                            Mme
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="civilite" value="Mr" checked={formData.civilite === 'Mr'} onChange={handleChange} className="mr-1" />
                            Mr
                        </label>
                    </div>

                    {/* Champs texte */}
                    <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                    <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

                    {/* Mot de passe avec icône œil */}
                    <div className="relative w-full mb-4">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute inset-y-0 right-2 px-2 bg-transparent text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Indice mot de passe */}
                    {passwordHint && (
                        <p className="text-xs text-red-500 mb-4">{passwordHint}</p>
                    )}

                    {/* Confirmation mot de passe avec œil */}
                    <div className="relative w-full mb-6">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirmer le mot de passe"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 border rounded pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(v => !v)}
                            className="absolute inset-y-0 right-2 px-2 bg-transparent text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Téléphone et adresse */}
                    <input type="tel" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} className="w-full p-2 border rounded mb-6" required />
                    <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} className="w-full p-2 border rounded mb-6" required />

                    {/* Bouton de validation */}
                    <button type="submit" className="w-1/2 mx-auto flex justify-center items-center bg-[#d9c275] text-white py-2 rounded hover:opacity-90 transition">
                        Je crée mon compte
                    </button>
                </form>
            </div>
        </div>
    );
}
