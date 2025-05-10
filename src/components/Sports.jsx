import { useState, useEffect } from 'react';

export default function Sports() {
    const [sportsData, setSportsData] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);

    useEffect(() => {
        // Vérifie si le code s'exécute dans le navigateur
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem('sportsVedettes');
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setSportsData(parsedData);
                } catch (error) {
                    console.error('Erreur lors du parsing de sportsVedettes:', error);
                }
            }
        }
    }, []);

    const openModal = (sport) => setSelectedSport(sport);
    const closeModal = () => setSelectedSport(null);

    return (
        <section className="bg-[#f4ede4] py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-800">
                {sportsData.map((sport, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <img
                            src={sport.image}
                            alt={sport.title}
                            className="w-72 h-44 object-cover rounded-md shadow-md mb-4"
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
                ))}
                {selectedSport && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
                            <button onClick={closeModal} className="absolute top-3 right-4 text-xl font-bold text-red-500">✖</button>
                            <h2 className="text-xl font-bold text-center mb-4">{selectedSport.title}</h2>
                            <img src={selectedSport.image} alt={selectedSport.title} className="w-full h-64 object-cover rounded mb-4" />
                            <p><strong>Lieu :</strong> {selectedSport.lieu || 'Lieu non précisé'}</p>
                            <p><strong>Date :</strong> {selectedSport.date || 'Date non précisée'}</p>
                            <p className="mt-2">{selectedSport.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}