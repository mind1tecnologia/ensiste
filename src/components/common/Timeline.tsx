import React from 'react';
import { EventoHistorico } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './Timeline.module.css';

interface TimelineProps {
    eventos: EventoHistorico[];
}

export const Timeline: React.FC<TimelineProps> = ({ eventos }) => {
    // Sort by date descending
    const sorted = [...eventos].sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

    return (
        <div className={styles.timeline}>
            {sorted.map((ev, index) => (
                <div key={ev.id} className={styles.item}>
                    <div className={styles.markerContainer}>
                        <div className={styles.marker} />
                        {index !== sorted.length - 1 && <div className={styles.line} />}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <span className={styles.date}>
                                {format(new Date(ev.dataHora), "dd/MMM 'às' HH:mm", { locale: ptBR })}
                            </span>
                            <span className={styles.responsavel}>• {ev.responsavel}</span>
                        </div>
                        <p className={styles.descricao}>{ev.descricao}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
