import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TicketsForm() {
    const [form, setForm] = useState({
        typeTicket: '',
        prixTicket: '',
        stock: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id) {
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
                    if (data.imageTicket) {
                        setImagePreview(`${import.meta.env.VITE_API_URL}${data.imageTicket}`);
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
        } else {
            setImageFile(null);
            setImagePreview('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const prix = parseFloat(form.prixTicket);
        const stock = parseInt(form.stock);

        if (!form.typeTicket || isNaN(prix) || isNaN(stock)) {
            setError("Veuillez remplir tous les champs correctement.");
            return;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id
            ? `${import.meta.env.VITE_API_URL}/api/tickets/${id}`
            : `${import.meta.env.VITE_API_URL}/api/tickets`;

        const ticketPayload = {
            ...form,
            prixTicket: prix,
            stock: stock,
        };

        const formData = new FormData();
        formData.append('ticket', JSON.stringify(ticketPayload));
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
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Modifier' : 'Ajouter'} un billet</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <label htmlFor="typeTicket" className="block mb-2">Type de billet</label>
            <input
                id="typeTicket"
                type="text"
                name="typeTicket"
                value={form.typeTicket}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mb-4"
                required
            />

            <label htmlFor="prixTicket" className="block mb-2">Prix (€)</label>
            <input
                id="prixTicket"
                type="number"
                name="prixTicket"
                value={form.prixTicket}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mb-4"
                required
            />

            <label htmlFor="stock" className="block mb-2">Stock</label>
            <input
                id="stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mb-4"
                required
            />

            <label htmlFor="image" className="block mb-2">Image</label>
            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-32 h-32 object-cover rounded mb-4"
                />
            )}
            <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
            />

            <button
                type="submit"
                className="bg-[#e0d2b9] text-gray-800 px-6 py-2 rounded hover:shadow-md transition"
            >
                {id ? 'Modifier' : 'Créer'} le billet
            </button>
        </form>
    );
}
