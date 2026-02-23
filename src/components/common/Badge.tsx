import React from 'react';
import { Status, Risco, Prioridade } from '../../types';
import styles from './Badge.module.css';
import clsx from 'clsx';

interface BadgeProps {
    type: 'status' | 'risco' | 'prioridade';
    value: Status | Risco | Prioridade | string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Aprovado':
            case 'Apto a faturar':
            case 'Faturado':
                return styles.success;
            case 'Em execução':
            case 'Em revisão interna':
                return styles.info;
            case 'Aguardando cliente':
            case 'Enviado ao cliente':
                return styles.warning;
            case 'Reprovado / Necessita ajuste':
                return styles.danger;
            default:
                return styles.default;
        }
    };

    const getRiscoClass = (risco: string) => {
        if (risco === 'Alto') return styles.danger;
        if (risco === 'Médio') return styles.warning;
        return styles.success;
    };

    const getPrioridadeClass = (prio: number) => {
        if (prio >= 4) return styles.danger;
        if (prio === 3) return styles.warning;
        return styles.info;
    };

    let badgeClass = '';
    if (type === 'status') badgeClass = getStatusClass(value as string);
    if (type === 'risco') badgeClass = getRiscoClass(value as string);
    if (type === 'prioridade') badgeClass = getPrioridadeClass(Number(value));

    return (
        <span className={clsx(styles.badge, badgeClass)}>
            {type === 'prioridade' ? `P${value}` : value}
        </span>
    );
};
