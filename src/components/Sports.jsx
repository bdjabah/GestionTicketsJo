import React, { useState, useEffect } from 'react';

export default function Sports() {
    const [sportsData, setSportsData] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const token = localStorage.getItem('token'); // ← Récupère le token

    useEffect(() => {
        const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
        if (!API_BASE) {
            console.error('❌ VITE_API_URL non défini');
            return;
        }

        async function fetchData() {
            try {
                const res = await fetch(`${API_BASE}/api/evenements`, {
                    headers: {
                        // ← Envoie le Bearer token si nécessaire
                        Authorization: token ? `Bearer ${token}` : undefined
                    }
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const raw = await res.json();

                const mapped = raw.map(evt => ({
                    id: evt.idEvenement,
                    title: evt.nomEvenement,
                    subtitle: `Discipline : ${evt.discipline}`,
                    description: evt.descriptionEvenement,
                    image: evt.imageUrl
                        ? `${API_BASE}/uploads/${evt.imageUrl}`
                        : null,
                    lieu: evt.lieuEvenement,
                    date: evt.dateEvenement
                }));

                setSportsData(mapped);
            } catch (err) {
                console.error('Erreur lors du fetch des événements :', err);
            }
        }

        fetchData();
    }, [token]);  // ← si le token change, on refetch

    const openModal = sport => setSelectedSport(sport);
    const closeModal = () => setSelectedSport(null);

    const getImageUrl = name => {
        if (!name) return '/fallback.jpg';
        if (name.startsWith('http://') || name.startsWith('https://')) {
            return name;
        }
        const clean = name.replace(/^\/+|\/+$/g, '');
        return `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/uploads/${clean}`;
    };

    return (
        <section className="bg-[#f4ede4] py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-800">
                {sportsData.length === 0 ? (
                    <p className="col-span-full text-center text-gray-600">
                        Aucun événement à afficher
                    </p>
                ) : (
                    sportsData.map(sport => (
                        <div key={sport.id} className="flex flex-col items-center text-center">
                            <img
                                src={getImageUrl(sport.image)}
                                alt={sport.title}
                                className="w-full h-64 object-cover rounded mb-4"
                            />
                            <h3 className="font-bold text-lg">{sport.title}</h3>
                            <em className="text-sm text-gray-700 mt-1">{sport.subtitle}</em>
                            <p className="text-sm mt-3 mb-4 px-4">{sport.description}</p>
                            <button
                                onClick={() => openModal(sport)}
                                className="bg-[#e0d2b9] text-gray-800 px-6 py-2 rounded-full shadow hover:shadow-lg transition"
                            >
                                Voir plus
                            </button>
                        </div>
                    ))
                )}

                {selectedSport && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-3 right-4 text-xl font-bold text-red-500"
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-bold text-center mb-4">
                                {selectedSport.title}
                            </h2>
                            <img
                                src={getImageUrl(selectedSport.image)}
                                alt={selectedSport.title}
                                className="w-full h-64 object-cover rounded mb-4"
                            />
                            <p><strong>Lieu :</strong> {selectedSport.lieu || 'non précisé'}</p>
                            <p><strong>Date :</strong> {selectedSport.date || 'non précisée'}</p>
                            <p className="mt-2">{selectedSport.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
