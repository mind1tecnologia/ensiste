import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { KanbanBoard } from '../../components/common/Kanban/KanbanBoard';
import { Badge } from '../../components/common/Badge';
import { Search, Filter, KanbanSquare, Table as TableIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Status } from '../../types';
import styles from './Entregaveis.module.css';

const STATUS_OPCOES: Status[] = [
    "Em execução",
    "Em revisão interna",
    "Enviado ao cliente",
    "Aguardando cliente",
    "Aprovado",
    "Reprovado / Necessita ajuste",
    "Apto a faturar",
    "Faturado"
];

export const Entregaveis = () => {
    const { documentos, updateDocumentoStatus } = useAppContext();
    const [viewMode, setViewMode] = useState<'lista' | 'kanban'>('kanban');
    const [busca, setBusca] = useState('');
    const navigate = useNavigate();

    const handleStatusChange = (id: string, newStatus: string) => {
        updateDocumentoStatus(id, newStatus as Status);
    };

    const filteredDocs = documentos.filter(doc =>
        doc.documento.toLowerCase().includes(busca.toLowerCase()) ||
        doc.projeto.toLowerCase().includes(busca.toLowerCase()) ||
        doc.cliente.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Entregáveis</h1>
                    <p className={styles.pageSubtitle}>Listagem completa de documentos e pacotes de engenharia.</p>
                </div>

                <div className={styles.actions}>
                    <div className={styles.searchBar}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por documento, projeto ou cliente..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <button className={styles.filterBtn}>
                        <Filter size={18} />
                        Filtros
                    </button>

                    <div className={styles.tabs}>
                        <button
                            className={clsx(styles.tabBtn, viewMode === 'lista' && styles.tabBtnActive)}
                            onClick={() => setViewMode('lista')}
                        >
                            <TableIcon size={18} />
                        </button>
                        <button
                            className={clsx(styles.tabBtn, viewMode === 'kanban' && styles.tabBtnActive)}
                            onClick={() => setViewMode('kanban')}
                        >
                            <KanbanSquare size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.contentArea}>
                {viewMode === 'kanban' ? (
                    <KanbanBoard documentos={filteredDocs} onCardClick={(doc) => navigate(`/documento/${doc.id}`)} />
                ) : (
                    <div className={styles.tableCard}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Cod / Doc</th>
                                    <th>Projeto</th>
                                    <th>Disciplina / Resp.</th>
                                    <th>Status (Alterar)</th>
                                    <th>Data Criação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.map(doc => (
                                    <tr key={doc.id}>
                                        <td onClick={() => navigate(`/documento/${doc.id}`)} className={styles.clickableCell}>
                                            <strong>{doc.documento}</strong><br />
                                            <span className={styles.muted}>{doc.pacote}</span>
                                        </td>
                                        <td onClick={() => navigate(`/documento/${doc.id}`)} className={styles.clickableCell}>
                                            <strong>{doc.projeto}</strong><br />
                                            <span className={styles.muted}>{doc.cliente}</span>
                                        </td>
                                        <td onClick={() => navigate(`/documento/${doc.id}`)} className={styles.clickableCell}>
                                            <strong>{doc.disciplina}</strong><br />
                                            <span className={styles.muted}>{doc.responsavel}</span>
                                        </td>
                                        <td>
                                            <div className={styles.statusCell}>
                                                <select
                                                    value={doc.status}
                                                    onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                                                    className={styles.statusSelect}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {STATUS_OPCOES.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <Badge type="status" value={doc.status} />
                                            </div>
                                        </td>
                                        <td onClick={() => navigate(`/documento/${doc.id}`)} className={styles.clickableCell}>
                                            {new Date(doc.dataCriacao).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};
