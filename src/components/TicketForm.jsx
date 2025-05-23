import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePanier } from '../context/PanierContext';
import { useTicketEdit } from '../context/TicketEditContext';

export default function TicketForm() {
    const { type } = useParams();
    const navigate = useNavigate();
    const { addToPanier, panier, setPanier } = usePanier();
    const { ticketToEdit, editIndex, setTicketToEdit, setEditIndex } = useTicketEdit();

    const countMap = { solo: 1, duo: 2, famille: 4 };
    const formCount = countMap[type] || 1;

    const [forms, setForms] = useState(
        ticketToEdit
            ? [ticketToEdit]
            : Array.from({ length: formCount }, () => ({
                civilite: '',
                prenom: '',
                nom: '',
                email: '',
                telephone: '',
            }))
    );

    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState(null);

    // Gère les changements de champs
    const handleChange = (index, field, value) => {
        const updated = [...forms];
        updated[index][field] = value;
        setForms(updated);
    };

    // Validation
    const isFormValid = (form) =>
        form.civilite && form.prenom && form.nom && form.email && form.telephone;

    // Soumission
    const handleSubmit = (e) => {
        e.preventDefault();
        const allValid = forms.every(isFormValid);

        if (!allValid) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setError('');

        if (ticketToEdit && editIndex !== null) {
            const updatedPanier = [...panier];
            updatedPanier[editIndex] = { ...forms[0], type };
            setPanier(updatedPanier);
            setTicketToEdit(null);
            setEditIndex(null);
            navigate('/panier');
        } else {
            const completedForms = forms.map((form) => ({ ...form, type }));
            addToPanier(completedForms);
            setConfirmation(completedForms);
        }
    };

    const handleCancel = () => {
        setTicketToEdit(null);
        setEditIndex(null);
        navigate('/boutique');
    };

    const handleReturnToShop = () => {
        navigate('/boutique');
    };

    const handleAccesToCart = () => {
        navigate('/panier');
    };

    return (
        <div className="pt-32 pb-16 px-6 bg-[#f4ede4] min-h-[calc(100vh-150px)] flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8 text-center">
                {ticketToEdit
                    ? 'Modifier le ticket'
                    : type === 'solo'
                        ? 'Information du ticket'
                        : `Information des tickets ${type.toUpperCase()}`}
            </h2>

            {error && (
                <p className="text-red-600 font-semibold bg-red-100 p-2 rounded my-4">
                    {error}
                </p>
            )}

            {!confirmation && (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-wrap justify-center gap-8 w-full max-w-6xl pb-10"
                >
                    {forms.map((data, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded shadow w-full sm:w-80"
                        >
                            <div className="mb-4 flex items-center gap-4">
                                <label>
                                    <input
                                        type="radio"
                                        name={`civilite-${index}`}
                                        value="Mme"
                                        checked={data.civilite === 'Mme'}
                                        onChange={(e) =>
                                            handleChange(index, 'civilite', e.target.value)
                                        }
                                    />{' '}
                                    Mme
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`civilite-${index}`}
                                        value="Mr"
                                        checked={data.civilite === 'Mr'}
                                        onChange={(e) =>
                                            handleChange(index, 'civilite', e.target.value)
                                        }
                                    />{' '}
                                    Mr
                                </label>
                            </div>
                            <input
                                type="text"
                                placeholder="Prénom"
                                className="border w-full p-2 rounded mb-3"
                                value={data.prenom}
                                onChange={(e) => handleChange(index, 'prenom', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Nom"
                                className="border w-full p-2 rounded mb-3"
                                value={data.nom}
                                onChange={(e) => handleChange(index, 'nom', e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="border w-full p-2 rounded mb-3"
                                value={data.email}
                                onChange={(e) => handleChange(index, 'email', e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Téléphone"
                                className="border w-full p-2 rounded mb-3"
                                value={data.telephone}
                                onChange={(e) =>
                                    handleChange(index, 'telephone', e.target.value)
                                }
                            />
                        </div>
                    ))}

                    <div className="w-full flex justify-center gap-6 mt-10">
                        <button
                            type="submit"
                            className="bg-[#d9c275] text-white px-6 py-2 rounded w-40 hover:opacity-90"
                        >
                            Valider
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-[#ccc] text-black px-6 py-2 rounded w-40 hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            )}

            {confirmation && (
                <div className="mt-8 bg-white text-[#8a6d3b] p-6 rounded-md shadow-md w-full max-w-3xl border border-white">
                    <h3 className="font-bold mb-4 text-center">
                        ✅ Tickets ajoutés au panier :
                    </h3>
                    {confirmation.map((ticket, i) => (
                        <div key={i} className="mb-2 border-b border-black pb-2">
                            🎟️ <strong>{ticket.civilite} {ticket.prenom} {ticket.nom}</strong><br />
                            📧 {ticket.email} <br /> 📱 {ticket.telephone}<br />
                        </div>
                    ))}

                    <div className="text-center mt-6 flex justify-center gap-4">

                        <button
                            onClick={handleReturnToShop}
                            className="bg-[#d9c275] text-white px-6 py-2 rounded hover:opacity-90"
                        >
                            Retour à la boutique
                        </button>
                        <button
                            onClick={handleAccesToCart}
                            className="bg-[#d9c275] text-white px-6 py-2 rounded hover:opacity-90"
                        >
                            Acceder au panier
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
