import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { KanbanBoard } from '../../components/common/Kanban/KanbanBoard';
import { Badge } from '../../components/common/Badge';
import { LayoutList, KanbanSquare, Play, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { differenceInDays, parseISO } from 'date-fns';
import styles from './Operacional.module.css';

export const Operacional = () => {
    const { documentos, setDocumentos, addToast } = useAppContext();
    const [viewMode, setViewMode] = useState<'fila' | 'kanban'>('fila');
    const navigate = useNavigate();

    const handleSimulateDay = () => {
        // Demo: Move some documents forward
        addToast({ message: "Simulando dia de trabalho...", type: "info", duration: 2000 });

        setTimeout(() => {
            setDocumentos(prevDocs => {
                return prevDocs.map(doc => {
                    if (doc.id === 'doc-2') {
                        return {
                            ...doc,
                            status: 'Em revisão interna',
                            historico: [...doc.historico, { id: Math.random().toString(), dataHora: new Date().toISOString(), descricao: "Trabalho concluído, enviado para revisão", responsavel: "Mariana Silva" }]
                        };
                    }
                    if (doc.id === 'doc-5') {
                        return {
                            ...doc,
                            status: 'Aprovado',
                            historico: [...doc.historico, { id: Math.random().toString(), dataHora: new Date().toISOString(), descricao: "Revisão interna aprovada diretamente", responsavel: "Coordenação" }]
                        };
                    }
                    return doc;
                });
            });
            addToast({ message: "O dia passou. Alguns itens avançaram de fase automaticamente.", type: "success" });
        }, 2000);
    };

    const getAging = (doc: any) => {
        const start = doc.dataEnvio ? parseISO(doc.dataEnvio) : parseISO(doc.dataCriacao);
        const end = doc.dataRetorno ? parseISO(doc.dataRetorno) : new Date();
        return Math.max(0, differenceInDays(end, start));
    };

    // Sort by aging and risk for Fila view
    const filaDocs = [...documentos].sort((a, b) => {
        const ageA = getAging(a);
        const ageB = getAging(b);
        if (ageB !== ageA) return ageB - ageA;
        return b.prioridade - a.prioridade;
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Cockpit Operacional</h1>
                    <p className={styles.pageSubtitle}>Gestão do dia a dia, bloqueios e movimentação de entregáveis.</p>
                </div>

                <div className={styles.actions}>
                    <div className={styles.tabs}>
                        <button
                            className={clsx(styles.tabBtn, viewMode === 'fila' && styles.tabBtnActive)}
                            onClick={() => setViewMode('fila')}
                        >
                            <LayoutList size={18} />
                            Fila de Destraves
                        </button>
                        <button
                            className={clsx(styles.tabBtn, viewMode === 'kanban' && styles.tabBtnActive)}
                            onClick={() => setViewMode('kanban')}
                        >
                            <KanbanSquare size={18} />
                            Kanban Operacional
                        </button>
                    </div>

                    <button className={styles.simulateBtn} onClick={handleSimulateDay}>
                        <Play size={18} fill="currentColor" />
                        Simular dia de trabalho
                    </button>
                </div>
            </header>

            <main className={styles.contentArea}>
                {viewMode === 'kanban' ? (
                    <KanbanBoard documentos={documentos} onCardClick={(doc) => navigate(`/documento/${doc.id}`)} />
                ) : (
                    <div className={styles.tableCard}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Prioridade</th>
                                    <th>Projeto / Cliente</th>
                                    <th>Documento / Responsável</th>
                                    <th>Status</th>
                                    <th>Aging / Risco</th>
                                    <th>Valor (R$)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filaDocs.map(doc => {
                                    const aging = getAging(doc);
                                    const isAgingHigh = aging > 7;
                                    const isAgingMed = aging > 3 && aging <= 7;

                                    return (
                                        <tr key={doc.id} onClick={() => navigate(`/documento/${doc.id}`)} className={styles.clickableRow}>
                                            <td><Badge type="prioridade" value={doc.prioridade} /></td>
                                            <td>
                                                <strong>{doc.projeto}</strong><br />
                                                <span className={styles.muted}>{doc.cliente}</span>
                                            </td>
                                            <td>
                                                <strong>{doc.documento}</strong><br />
                                                <span className={styles.muted}>{doc.responsavel}</span>
                                            </td>
                                            <td>
                                                <Badge type="status" value={doc.status} />
                                                {doc.bloqueio && <div className={styles.blockWarning}>Bloqueado</div>}
                                            </td>
                                            <td>
                                                <div className={styles.riskAgingCell}>
                                                    <div className={clsx(styles.agingPill, isAgingHigh ? styles.agingDanger : isAgingMed ? styles.agingWarning : styles.agingNormal)}>
                                                        <Clock size={12} /> {aging}d
                                                    </div>
                                                    <Badge type="risco" value={doc.risco} />
                                                </div>
                                            </td>
                                            <td>
                                                <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(doc.valorEstimado)}</strong>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};
