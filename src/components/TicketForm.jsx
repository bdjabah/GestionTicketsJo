import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TicketForm() {
    const { type } = useParams();
    const navigate = useNavigate();

    // Détermine le nombre de formulaires selon le type
    const countMap = { solo: 1, duo: 2, famille: 4 };
    const formCount = countMap[type] || 1;

    const [forms, setForms] = useState(
        Array.from({ length: formCount }, () => ({
            civilite: '',
            prenom: '',
            nom: '',
            email: '',
            telephone: '',
        }))
    );

    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState([]);

    // Gère les changements de champs
    const handleChange = (index, field, value) => {
        const updated = [...forms];
        updated[index][field] = value;
        setForms(updated);
    };

    // Vérifie que tous les champs sont remplis
    const isFormValid = (form) =>
        form.civilite && form.prenom && form.nom && form.email && form.telephone;

    const handleSubmit = (e) => {
        e.preventDefault();
        const allValid = forms.every(isFormValid);

        if (!allValid) {
            setError("Veuillez remplir tous les champs.");
            setConfirmation([]);
        } else {
            setError('');
            setConfirmation(forms);
        }
    };

    const handleCancel = () => {
        navigate('/boutique');
    };

    return (
        <div className="pt-32 pb-16 px-6 bg-[#f4ede4] min-h-[calc(100vh-150px)] flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8 text-center">
                {type === 'solo'
                    ? 'Information du ticket'
                    : `Information des tickets ${type.toUpperCase()}`}
            </h2>

            {error && (
                <p className="text-red-600 font-semibold bg-red-100 p-2 rounded my-4">
                    {error}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className={`flex flex-wrap justify-center gap-8 w-full max-w-6xl pb-10`}
            >
                {forms.map((data, index) => (
                    <div key={index} className="bg-white p-6 rounded shadow w-full sm:w-80">
                        <div className="mb-4 flex items-center gap-4">
                            <label>
                                <input
                                    type="radio"
                                    name={`civilite-${index}`}
                                    value="Mme"
                                    checked={data.civilite === 'Mme'}
                                    onChange={(e) => handleChange(index, 'civilite', e.target.value)}
                                />{' '}
                                Mme
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name={`civilite-${index}`}
                                    value="Mr"
                                    checked={data.civilite === 'Mr'}
                                    onChange={(e) => handleChange(index, 'civilite', e.target.value)}
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
                            onChange={(e) => handleChange(index, 'telephone', e.target.value)}
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

            {confirmation.length > 0 && (
                <div className="mt-8 bg-white text-[#8a6d3b] p-4 rounded-md shadow-md w-full max-w-3xl border border-white">
                    <h3 className="font-bold mb-2 text-center">✅ Tickets ajoutés au panier :</h3>
                    {confirmation.map((ticket, i) => (
                        <div key={i} className="mb-2 border-b border-black pb-2">
                            🎟️ <strong>{ticket.civilite} {ticket.prenom} {ticket.nom}</strong><br />
                            📧 {ticket.email} <br /> 📱 {ticket.telephone}<br />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
