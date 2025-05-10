import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TicketForm() {
    const [form, setForm] = useState({
        typeTicket: '',
        prixTicket: '',
        stock: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // ID du billet à modifier, si présent
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id) {
            // Si un ID est présent, on est en mode édition : récupérer les données du billet
            fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Erreur lors du chargement du billet');
                    return res.json();
                })
                .then((data) => {
                    setForm({
                        typeTicket: data.typeTicket,
                        prixTicket: data.prixTicket,
                        stock: data.stock,
                    });
                    if (data.imageUrl) {
                        setImagePreview(`${import.meta.env.VITE_API_URL}/uploads/${data.imageUrl}`);
                    }
                })
                .catch((err) => setError(err.message));
        }
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = id ? 'PUT' : 'POST';
        const url = id
            ? `${import.meta.env.VITE_API_URL}/api/tickets/${id}`
            : `${import.meta.env.VITE_API_URL}/api/tickets`;

        const formData = new FormData();
        formData.append('typeTicket', form.typeTicket);
        formData.append('prixTicket', form.prixTicket);
        formData.append('stock', form.stock);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de l'enregistrement du billet");
                navigate('/admin/tickets');
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="p-8 max-w-4xl mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-6">{id ? 'Modifier le billet' : 'Ajouter un billet'}</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-md space-y-4">
                <div>
                    <label className="block font-medium">Type de billet</label>
                    <input
                        type="text"
                        name="typeTicket"
                        value={form.typeTicket}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Prix (€)</label>
                    <input
                        type="number"
                        name="prixTicket"
                        value={form.prixTicket}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Stock disponible</label>
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Image du billet</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border rounded w-full p-2"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="mt-4 w-48 h-32 object-cover rounded-md shadow"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition"
                >
                    {id ? 'Mettre à jour' : 'Ajouter'}
                </button>
            </form>
        </div>
    );
}
