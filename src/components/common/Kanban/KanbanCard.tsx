import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Documento } from '../../../types';
import { Badge } from '../Badge';
import { differenceInDays, parseISO } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';
import styles from './Kanban.module.css';
import clsx from 'clsx';

interface KanbanCardProps {
    documento: Documento;
    isOverlay?: boolean;
    onClick: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ documento, isOverlay, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: documento.id,
        data: {
            type: 'Documento',
            documento,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const calculateAging = () => {
        const start = documento.dataEnvio ? parseISO(documento.dataEnvio) : parseISO(documento.dataCriacao);
        const end = documento.dataRetorno ? parseISO(documento.dataRetorno) : new Date();
        return Math.max(0, differenceInDays(end, start));
    };

    const agingDays = calculateAging();

    const getAgingClass = () => {
        if (agingDays > 7) return styles.agingDanger;
        if (agingDays > 3) return styles.agingWarning;
        return styles.agingNormal;
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={clsx(styles.cardPlaceholder)}
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(styles.card, isOverlay && styles.cardOverlay)}
            {...attributes}
            {...listeners}
            onClick={onClick}
        >
            <div className={styles.cardHeader}>
                <span className={styles.cardProject}>{documento.projeto}</span>
                <Badge type="risco" value={documento.risco} />
            </div>

            <h4 className={styles.cardTitle}>{documento.documento}</h4>
            <p className={styles.cardClient}>{documento.cliente}</p>

            {documento.bloqueio && (
                <div className={styles.blockage}>
                    <AlertTriangle size={12} />
                    <span>{documento.bloqueio}</span>
                </div>
            )}

            <div className={styles.cardFooter}>
                <span className={styles.cardValue}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(documento.valorEstimado)}
                </span>

                <div className={clsx(styles.aging, getAgingClass())}>
                    <Clock size={12} />
                    <span>{agingDays}d</span>
                </div>
            </div>
        </div>
    );
};
