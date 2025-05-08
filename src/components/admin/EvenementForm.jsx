import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EvenementForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        nomEvenement: '',
        discipline: '',
        dateEvenement: '',
        lieuEvenement: '',
        description: '',
        image: null,
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetch(`${import.meta.env.VITE_API_URL}/api/evenements/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        ...data,
                        image: null,
                    });
                })
                .catch(err => {
                    console.error("Erreur de chargement :", err);
                    setError("Échec du chargement de l'événement");
                });
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const form = new FormData();
        form.append('nomEvenement', formData.nomEvenement);
        form.append('discipline', formData.discipline);
        form.append('dateEvenement', formData.dateEvenement);
        form.append('lieuEvenement', formData.lieuEvenement);
        form.append('description', formData.description);
        if (formData.image) {
            form.append('image', formData.image);
        }

        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit
            ? `${import.meta.env.VITE_API_URL}/api/evenements/${id}`
            : `${import.meta.env.VITE_API_URL}/api/evenements`;

        try {
            const res = await fetch(url, {
                method,
                body: form,
            });

            if (!res.ok) {
                throw new Error("Échec de l'enregistrement");
            }

            navigate('/admin/evenements');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="mt-16 flex justify-center px-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isEdit ? 'Modifier' : 'Créer'} un Événement
                </h2>

                {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <input
                        type="text"
                        name="nomEvenement"
                        placeholder="Nom de l'événement"
                        value={formData.nomEvenement}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="discipline"
                        placeholder="Discipline"
                        value={formData.discipline}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="date"
                        name="dateEvenement"
                        value={formData.dateEvenement}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="lieuEvenement"
                        placeholder="Lieu"
                        value={formData.lieuEvenement}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows={4}
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#d9c275] text-white px-6 py-2 rounded hover:opacity-90 transition"
                        >
                            {isEdit ? 'Mettre à jour' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}