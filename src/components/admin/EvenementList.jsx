import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EvenementList() {
    const [evenements, setEvenements] = useState([]);
    const navigate = useNavigate();

    // 🔄 Chargement des événements
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/evenements`)
            .then(res => res.json())
            .then(data => setEvenements(data))
            .catch(err => console.error("Erreur de chargement des événements :", err));
    }, []);

    // 🗑️ Suppression d’un événement
    const handleDelete = async (id) => {
        if (!window.confirm("Confirmer la suppression de cet événement ?")) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/evenements/${id}`, {
                method: 'DELETE',
            });
            setEvenements(prev => prev.filter(e => e.idEvenement !== id));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    return (
        <div className=" mt-12 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Liste des Événements</h2>
                <button
                    onClick={() => navigate('/admin/evenements/nouveau')}
                    className="bg-[#e0d2b9] text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Ajouter un événement
                </button>
            </div>

            <table className="w-full table-auto border">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">Nom</th>
                        <th>Discipline</th>
                        <th>Date</th>
                        <th>Lieu</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {evenements.map((evt) => (
                        <tr key={evt.idEvenement} className="text-center border-t">
                            <td className="px-4 py-2">{evt.nomEvenement}</td>
                            <td>{evt.discipline}</td>
                            <td>{evt.dateEvenement}</td>
                            <td>{evt.lieuEvenement}</td>
                            <td className="space-x-2">
                                <button
                                    onClick={() => navigate(`/admin/evenements/${evt.idEvenement}/edit`)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(evt.idEvenement)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}