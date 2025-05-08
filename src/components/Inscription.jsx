import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import inscriptionBg from '../assets/img-inscription.jpg';
import { useAuth } from '../context/useAuth.jsx';

export default function Inscription() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        civilite: '',
        prenom: '',
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
        telephone: '',
    });

    const [error, setError] = useState('');
    const [passwordHint, setPasswordHint] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "password") {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
            if (!regex.test(value)) {
                setPasswordHint("Le mot de passe doit contenir une majuscule, une minuscule et un chiffre.");
            } else {
                setPasswordHint("");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Vérifications
        const { civilite, prenom, nom, email, password, confirmPassword, telephone, adresse } = formData;

        if (!civilite || !prenom || !nom || !email || !password || !confirmPassword || !telephone || !adresse) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

        // Validation mot de passe côté frontend
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(password)) {
            setError("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // 🔐 Appel réel au backend pour enregistrer l’utilisateur
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom,
                    prenom,
                    email,
                    motDePasse: password,
                    telephone,
                    civilite,
                    adresse,
                }),
            });

            if (!res.ok) {
                const message = await res.text();
                setError(message || "Erreur lors de l'inscription.");
                return;
            }

            // ✔️ Connexion automatique après inscription réussie
            const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, motDePasse: password }),
            });

            if (!loginRes.ok) {
                setError("Inscription réussie, mais erreur lors de la connexion.");
                return;
            }

            const loginData = await loginRes.json();
            await login(loginData.token);

            // Redirection vers la page d’accueil
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Erreur lors de l'inscription.");
        }
    };

    return (
        <div className="flex flex-1 min-h-[calc(100vh-130px)] mt-16">
            <div className="hidden md:block w-1/2">
                <img src={inscriptionBg} alt="Inscription" className="w-full h-full object-cover" />
            </div>

            <div className="w-full md:w-1/2 bg-[#f4ede4] h-full flex items-center justify-center px-8 py-10">
                <button onClick={() => navigate(-1)} type="button"
                    className="mb-4 w-10 px-3 h-10 rounded-full bg-[#d9c275] text-black text-lg flex items-center justify-center mr-auto">
                    ←
                </button>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">


                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center font-semibold">
                            {error}
                        </div>
                    )}
                    <p className="text-sm text-gray-600 mb-4">
                        <strong>Tous les champs sont obligatoires</strong>. Veuillez remplir le formulaire avec des informations valides.
                    </p>
                    <div className="flex gap-4 mb-2">
                        <label className="flex items-center">
                            <input type="radio" name="civilite" value="Mme" checked={formData.civilite === "Mme"} onChange={handleChange} className="mr-1" />
                            Mme
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="civilite" value="Mr" checked={formData.civilite === "Mr"} onChange={handleChange} className="mr-1" />
                            Mr
                        </label>
                    </div>

                    <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                    <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                    <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded mb-4" required /> {passwordHint && (
                        <p className="text-xs text-red-500 mb-4">{passwordHint}</p>
                    )}

                    <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                    <input type="tel" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} className="w-full p-2 border rounded mb-6" required />
                    <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse || ""} onChange={handleChange} className="w-full p-2 border rounded mb-6" required />
                    <button type="submit" className="w-1/2 mx-auto flex justify-center items-center mx-auto bg-[#d9c275] text-white py-2 rounded hover:opacity-90 transition">
                        Je crée mon compte
                    </button>
                </form>
            </div>
        </div>
    );
}
