import { createContext, useContext, useState } from 'react';

const TicketEditContext = createContext();

export const TicketEditProvider = ({ children }) => {
    const [ticketToEdit, setTicketToEdit] = useState(null);
    const [editIndex, setEditIndex] = useState(null);

    return (
        <TicketEditContext.Provider value={{ ticketToEdit, setTicketToEdit, editIndex, setEditIndex }}>
            {children}
        </TicketEditContext.Provider>
    );
};

export const useTicketEdit = () => useContext(TicketEditContext);
