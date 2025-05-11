import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role.nomRole !== 'ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="mt-20 p-6 bg-[#f5ede2] min-h-screen text-black mx-4 md:mx-16">
            <h1 className="text-3xl font-bold mb-8">Espace Administrateur</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <button
                    onClick={() => navigate('/admin/evenements')}
                    className="bg-white text-black border border-gray-300 rounded-lg p-6 hover:bg-[#f0e7d8] transition text-left"
                >
                    <span className="text-xl font-semibold">Gestion Événements</span>
                </button>
                <button
                    onClick={() => navigate('/admin/tickets')}
                    className="bg-white text-black border border-gray-300 rounded-lg p-6 hover:bg-[#f0e7d8] transition text-left"
                >
                    <span className="text-xl font-semibold">Gestion Boutique</span>
                </button>
                <button
                    onClick={() => navigate('/admin/commandes')}
                    className="bg-white text-black border border-gray-300 rounded-lg p-6 hover:bg-[#f0e7d8] transition text-left"
                >
                    <span className="text-xl font-semibold">Gestion Commandes</span>
                </button>
            </div>

            {/* Stats & Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-2xl font-bold">2.5K</h2>
                    <p className="text-gray-600">Visites aujourd’hui</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-xl font-semibold mb-2">Événements à venir</h2>
                    <p className="text-sm text-gray-500 italic">Aucun événement</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-xl font-semibold mb-2">Commandes récentes</h2>
                    <p className="text-sm text-gray-500 italic">Aucune commande</p>
                </div>

            </div>
        </div>
    );
}