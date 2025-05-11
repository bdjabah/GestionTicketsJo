import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EvenementList() {
    const [evenements, setEvenements] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/evenements`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Erreur lors du chargement');
                return res.json();
            })
            .then((data) => setEvenements(data))
            .catch((err) => setError(err.message));
    }, [token]);

    const supprimerEvenement = (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet événement ?')) return;

        fetch(`${import.meta.env.VITE_API_URL}/api/evenements/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Échec de la suppression');
                setEvenements((prev) => prev.filter((ev) => ev.idEvenement !== id));
            })
            .catch((err) => alert(err.message));
    };
    const handleAjouterAccueil = (evenement) => {
        const sportVedette = {
            id: evenement.idEvenement, // ID unique
            title: evenement.nomEvenement,
            subtitle: `Discipline : ${evenement.discipline}`,
            description: evenement.descriptionEvenement,
            image: `${import.meta.env.VITE_API_URL}/uploads/${evenement.imageUrl}`,
            lieu: evenement.lieuEvenement,
            date: evenement.dateEvenement
        };

        const sportsVedettes = JSON.parse(localStorage.getItem('sportsVedettes')) || [];
        const existeDeja = sportsVedettes.some(s => s.id === sportVedette.id);

        if (existeDeja) {
            alert("Déjà présent sur la page d'accueil");
            return;
        }

        sportsVedettes.push(sportVedette);
        localStorage.setItem('sportsVedettes', JSON.stringify(sportsVedettes));
        alert("Ajouté à la page d'accueil");
    };

    const handleRetirerAccueil = (evenementId) => {
        const sportsVedettes = JSON.parse(localStorage.getItem('sportsVedettes')) || [];
        const updated = sportsVedettes.filter(e => e.id !== evenementId);

        localStorage.setItem('sportsVedettes', JSON.stringify(updated));
        alert("Retiré de la page d'accueil");
    };

    const estDansAccueil = (id) => {
        const sportsVedettes = JSON.parse(localStorage.getItem('sportsVedettes')) || [];
        return sportsVedettes.some(e => e.id === id);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto mt-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Liste des événements</h2>
                <button
                    onClick={() => navigate('/admin/evenements/new')}
                    className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition"
                >
                    Ajouter un événement
                </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="space-y-6">
                {evenements.map((event) => (
                    <div
                        key={event.idEvenement}
                        className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 "
                    >
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.nomEvenement}</h3>
                            <p><strong>Discipline :</strong> {event.discipline}</p>
                            <p><strong>Date :</strong> {event.dateEvenement}</p>
                            <p><strong>Lieu :</strong> {event.lieuEvenement}</p>
                            <p><strong>Description :</strong> {event.descriptionEvenement}</p>
                        </div>
                        {event.imageUrl && (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/${event.imageUrl}`}
                                alt={event.nomEvenement}
                                className="w-40 h-28 object-cover rounded-md"
                            />
                        )}
                        <div className="flex flex-col gap-2 items-end">
                            <button
                                onClick={() => navigate(`/admin/evenements/${event.idEvenement}/edit`)}
                                className="hover:shadow-md text-white px-4 py-1 rounded"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => supprimerEvenement(event.idEvenement)}
                                className="hover:shadow-md text-white px-4 py-1 rounded"
                            >
                                ❌
                            </button>
                        </div>
                        {estDansAccueil(event.idEvenement) ? (
                            <button
                                onClick={() => handleRetirerAccueil(event.idEvenement)}
                                className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition"
                            >
                                Retirer de la page d'accueil
                            </button>
                        ) : (
                            <button
                                onClick={() => handleAjouterAccueil(event)}
                                className="bg-[#e0d2b9] text-gray-800 px-4 py-2 rounded-md hover:shadow-md transition"
                            >
                                Ajouter à la page d'accueil
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
