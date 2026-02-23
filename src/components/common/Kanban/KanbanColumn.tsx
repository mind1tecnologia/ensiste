import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { Documento, Status } from '../../../types';
import styles from './Kanban.module.css';

interface KanbanColumnProps {
    status: Status;
    documentos: Documento[];
    onCardClick: (doc: Documento) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, documentos, onCardClick }) => {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    return (
        <div className={styles.columnContainer}>
            <div className={styles.columnHeader}>
                <h3 className={styles.columnTitle}>{status}</h3>
                <span className={styles.columnCount}>{documentos.length}</span>
            </div>

            <div ref={setNodeRef} className={styles.columnDropZone}>
                <SortableContext
                    id={status}
                    items={documentos.map(d => d.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {documentos.map((doc) => (
                        <KanbanCard key={doc.id} documento={doc} onClick={() => onCardClick(doc)} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};
