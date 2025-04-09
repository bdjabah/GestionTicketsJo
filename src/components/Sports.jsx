import athletisme from '../assets/athletisme.jpg';
import taekwondo from '../assets/taekwondo.jpg';
import escrime from '../assets/escrime.jpg';
const sportsData = [
    {
        title: "L'athlétisme",
        subtitle: "L’essence des Jeux Olympiques",
        description: "L'athlétisme est l’âme des Jeux Olympiques, regroupant des disciplines variées telles que la course, le saut et le lancer. Chaque épreuve met en avant la force, la vitesse et l’endurance des athlètes dans des moments d’émotion intense.",
        image: athletisme,
    },
    {
        title: "Taekwondo",
        subtitle: "L’Esprit du Combat Coréen",
        description: "Sport d’arts martiaux moderne, le taekwondo se distingue par ses coups de pied spectaculaires et sa philosophie d’autodiscipline et de respect.",
        image: taekwondo,
    },
    {
        title: "Escrime",
        subtitle: "L’Art de la Lame",
        description: "Discipline olympique emblématique, l’escrime allie rapidité, précision et stratégie. Les athlètes s’affrontent dans des duels captivants avec épée, fleuret ou sabre.",
        image: escrime,
    },
];
export default function Sports() {
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
                        <button className="bg-[#e0d2b9] text-gray-800 px-6 py-2 rounded-full shadow hover:shadow-lg transition">
                            Voir plus
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}