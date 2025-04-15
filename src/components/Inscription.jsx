import React from 'react';
import { useNavigate } from 'react-router-dom';
import inscriptionBg from '../assets/img-inscription.jpg'; // remplace par le bon chemin

export default function Inscription() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-1 min-h-[calc(100vh-130px)]">
            {/* Image à gauche (cache en responsive) */}
            <div className="hidden md:block w-1/2">
                <img
                    src={inscriptionBg}
                    alt="Inscription"
                    className="w-full h-full object-cover"
                />
            </div>


            {/* Formulaire à droite */}
            <div className="w-full md:w-1/2 bg-[#f4ede4] h-full flex items-center justify-center px-8 py-10">
                {/* Bouton retour */}
                <button
                    onClick={handleBack}
                    className="mb-4 w-10 px-3 h-10 rounded-full bg-[#d9c275] text-black text-lg flex items-center justify-center mr-auto"
                >
                    ←
                </button>

                {/* Formulaire */}
                <form
                    className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto flex flex-col justify-between "
                    onSubmit={(e) => {
                        e.preventDefault();
                        // ici tu peux ajouter une vraie logique plus tard
                        alert("Compte créer");
                    }}
                >
                    <div className="flex gap-4 mb-2 ">
                        <label className="flex items-center" >
                            <input type="radio" name="civilite" value="Mme" className="mr-1" required />
                            Mme
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="civilite" value="Mr" className="mr-1" />
                            Mr
                        </label>
                    </div>

                    <input
                        type="text"
                        placeholder="Prénom"
                        className="w-full p-2 border rounded mb-4"
                        name="prenom"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nom"
                        className="w-full p-2 border rounded mb-4"
                        name="nom"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded mb-4"
                        name="email"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full p-2 border rounded mb-4"
                        name="password"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        className="w-full p-2 border rounded mb-4"
                        name="confirmPassword"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Téléphone"
                        className="w-full p-2 border rounded mb-6"
                        name="telephone"
                        required
                    />

                    <button
                        type="submit"
                        className=" w-1/2 mx-auto  flex justify-center items-center bg-[#d9c275] text-white  py-2 rounded hover:opacity-90 transition"
                    >
                        Je crée mon compte
                    </button>
                </form>

            </div>
        </div>
    );
}
