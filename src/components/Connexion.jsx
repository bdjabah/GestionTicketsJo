// src/components/Connexion.jsx
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaApple } from 'react-icons/fa';
import loginImage from '../assets/img-page-connexion.png';


export default function Connexion() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-130px)] grid grid-cols-1 md:grid-cols-2 bg-[#f4ede4]">
            {/* Left: Image full height */}
            <div className="hidden md:block bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}></div>

            {/* Right: Connexion form */}
            <div className="relative flex flex-col justify-start items-center p-8">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 w-10 px-3 h-10 rounded-full bg-[#d9c275] text-black text-lg flex items-center justify-center mr-auto"
                >
                    ←
                </button>

                {/* Form */}
                <div className="w-full max-w-md mx-auto mt-2 bg-white p-6 rounded shadow-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <button className="w-1/2 mx-auto  flex justify-center items-center bg-[#d9c275] text-white py-2 rounded hover:opacity-90 transition">
                        Je me connecte
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center w-full max-w-sm my-6">
                    <hr className="flex-grow border-black" />
                    <span className="px-4 text-lg">Ou se connecter avec</span>
                    <hr className="flex-grow border-black" />
                </div>

                {/* Social buttons */}
                <div className="flex space-x-6 mb-6">
                    <FaGoogle className="text-3xl cursor-pointer hover:opacity-75" />
                    <FaApple className="text-3xl cursor-pointer hover:opacity-75" />
                </div>

                {/* New account */}
                <p className="mb-2">Nouveau client?</p>
                <button
                    onClick={() => navigate('/inscription')}
                    className="bg-[#d9c275] text-white px-6 py-2 rounded hover:opacity-90"
                >
                    Je crée un nouveau compte
                </button>
            </div>
        </div>
    );
}
