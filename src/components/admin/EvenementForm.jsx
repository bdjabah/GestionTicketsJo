import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EvenementForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nomEvenement: '',
        discipline: '',
        dateEvenement: '',
        lieuEvenement: '',
        descriptionEvenement: '',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem("token");

    // Gestion des champs texte
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gestion du fichier image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);

        // Génère l'URL de preview
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);  // reader.result est une data-URL
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = new FormData();
            data.append("evenement", JSON.stringify(formData)); // les champs en JSON texte
            if (image) data.append("image", image); // l'image

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/evenements/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Erreur lors de la création');
            }

            navigate('/admin'); // redirige après succès
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 mt-20 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Créer un événement</h2>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <input name="nomEvenement" placeholder="Nom" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
            <input name="discipline" placeholder="Discipline" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
            <input type="date" name="dateEvenement" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
            <input name="lieuEvenement" placeholder="Lieu" onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
            <textarea name="descriptionEvenement" placeholder="Description" onChange={handleChange} className="w-full mb-4 p-2 border rounded" />

            <label className="mb-4 inline-block cursor-pointer bg-gray-100 px-3 py-2 rounded">
                Choisir une image
                {imagePreview && <img src={imagePreview} alt="Aperçu" />}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </label>

            <div className="flex justify-end mt-4">
                <button type="submit" className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition">
                    Enregistrer
                </button>
            </div>
        </form>
    );
} //<input type="file" onChange={handleImageChange} accept="image/*" className="mb-4" />