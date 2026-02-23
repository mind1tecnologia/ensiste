import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Documento, Status } from '../types';
import { initialMockData } from '../data/mockData';

interface Toast {
    id: string;
    message: string;
    type?: "info" | "success" | "warning" | "error";
    duration?: number;
}

interface AppContextType {
    documentos: Documento[];
    setDocumentos: React.Dispatch<React.SetStateAction<Documento[]>>;
    updateDocumentoStatus: (id: string, newStatus: Status, responsavel?: string) => void;
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [documentos, setDocumentos] = useState<Documento[]>(initialMockData);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);
        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const updateDocumentoStatus = (id: string, newStatus: Status, responsavel: string = "Usuário (Demo)") => {
        setDocumentos((prevDocs) =>
            prevDocs.map((doc) => {
                if (doc.id === id) {
                    if (doc.status !== newStatus) {
                        const historyEvent = {
                            id: Math.random().toString(36).substr(2, 9),
                            dataHora: new Date().toISOString(),
                            descricao: `Status alterado de "${doc.status}" para "${newStatus}"`,
                            responsavel
                        };
                        return {
                            ...doc,
                            status: newStatus,
                            historico: [...doc.historico, historyEvent]
                        };
                    }
                }
                return doc;
            })
        );
        addToast({ message: `Automação (demo): histórico atualizado / follow-up aplicado`, type: "success" });
    };

    return (
        <AppContext.Provider value={{
            documentos,
            setDocumentos,
            updateDocumentoStatus,
            toasts,
            addToast,
            removeToast
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
