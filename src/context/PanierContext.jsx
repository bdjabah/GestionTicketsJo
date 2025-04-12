import { createContext, useContext, useState } from 'react';

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
    const [panier, setPanier] = useState([]);

    const addToPanier = (newItems) => {
        setPanier((prev) => [...prev, ...newItems]);
    };

    const resetPanier = () => {
        setPanier([]);
    };

    const removeFromPanier = (indexToRemove) => {
        setPanier((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <PanierContext.Provider value={{ panier, addToPanier, resetPanier, removeFromPanier }}>
            {children}
        </PanierContext.Provider>
    );
};

export const usePanier = () => useContext(PanierContext);
