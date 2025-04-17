//src/components/hero.jsx
import heroImage from '../assets/img-hero-homepage.jpg'; // Vérifie le chemin et le nom
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    const goToBoutique = () => {
        navigate('/boutique');
    };
    return (
        <section className="relative mt-20 px-2 sm:px-4 lg:px-6">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                    src={heroImage}
                    alt="Jeux Olympiques 2024"
                    className="w-full h-[500px] object-cover"
                />
                {/* Texte centré en haut */}
                <div className="absolute top-10 left-0 right-0 flex flex-col items-center z-10">
                    <h1 className="text-white text-4xl sm:text-5xl font-serif font-bold text-center drop-shadow-lg">
                        Bienvenue aux Jeux Olympiques 2024
                    </h1>
                </div>

                {/* Bouton en bas à droite */}
                <div className="absolute bottom-6 right-6 z-50">
                    <button
                        onClick={goToBoutique}
                        className="relative bg-[#e0d2b9] text-gray-800 px-6 py-2 rounded-full shadow hover:shadow-lg transition"
                    >
                        Voir les offres
                    </button>


                </div>
            </div>
        </section>
    );
}
