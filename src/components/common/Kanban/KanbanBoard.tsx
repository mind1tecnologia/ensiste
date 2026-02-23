import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { Documento, Status } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import styles from './Kanban.module.css';

interface KanbanBoardProps {
    documentos: Documento[];
    onCardClick: (doc: Documento) => void;
}

const COLUNAS: Status[] = [
    "Em execução",
    "Em revisão interna",
    "Enviado ao cliente",
    "Aguardando cliente",
    "Reprovado / Necessita ajuste",
    "Aprovado",
    "Apto a faturar",
    "Faturado"
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ documentos, onCardClick }) => {
    const { updateDocumentoStatus } = useAppContext();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px drag to trigger
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getDocFromId = (id: string) => documentos.find(d => d.id === id);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeDoc = getDocFromId(activeId);

        // Check if we dropped on a column or another item
        const isOverAColumn = COLUNAS.includes(overId as Status);
        const overDoc = getDocFromId(overId);

        let newStatus: Status | undefined;

        if (isOverAColumn) {
            newStatus = overId as Status;
        } else if (overDoc) {
            newStatus = overDoc.status;
        }

        if (newStatus && activeDoc && activeDoc.status !== newStatus) {
            updateDocumentoStatus(activeId, newStatus);
        }
    };

    return (
        <div className={styles.boardContainer}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.columns}>
                    {COLUNAS.map((coluna) => {
                        const docsInColumn = documentos.filter(d => d.status === coluna);
                        return (
                            <KanbanColumn key={coluna} status={coluna} documentos={docsInColumn} onCardClick={onCardClick} />
                        );
                    })}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <KanbanCard
                            documento={getDocFromId(activeId)!}
                            isOverlay
                            onClick={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
