import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { CheckCircle, Banknote, FileText, ChevronRight } from 'lucide-react';
import styles from './Financeiro.module.css';

export const Financeiro = () => {
    const { documentos, updateDocumentoStatus } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

    // Itens aptos a faturar
    const filaFaturamento = documentos.filter(d => d.status === 'Apto a faturar');

    const handleToggleSelect = (id: string) => {
        if (selectedDocs.includes(id)) {
            setSelectedDocs(prev => prev.filter(docId => docId !== id));
        } else {
            setSelectedDocs(prev => [...prev, id]);
        }
    };

    const handleToggleAll = () => {
        if (selectedDocs.length === filaFaturamento.length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs(filaFaturamento.map(d => d.id));
        }
    };

    const valorTotalSelecionado = filaFaturamento
        .filter(d => selectedDocs.includes(d.id))
        .reduce((acc, doc) => acc + doc.valorEstimado, 0);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const handleGerarRascunho = () => {
        if (selectedDocs.length === 0) return;
        setIsModalOpen(true);
    };

    const confirmarFaturamento = () => {
        selectedDocs.forEach(id => {
            updateDocumentoStatus(id, 'Faturado', 'Financeiro (Demo)');
        });
        setIsModalOpen(false);
        setSelectedDocs([]);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Financeiro (Pré-faturamento)</h1>
                    <p className={styles.pageSubtitle}>Aprove os entregáveis validados pela engenharia e emita notas fiscais.</p>
                </div>
                <button
                    className={selectedDocs.length > 0 ? styles.actionButton : styles.actionButtonDisabled}
                    onClick={handleGerarRascunho}
                    disabled={selectedDocs.length === 0}
                >
                    <Banknote size={18} /> Gerar Rascunho NF (Demo)
                </button>
            </header>

            <div className={styles.layoutGrid}>
                <div className={styles.mainColumn}>
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <h3>Fila de Faturamento (Projetos Aprovados)</h3>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={selectedDocs.length === filaFaturamento.length && filaFaturamento.length > 0}
                                            onChange={handleToggleAll}
                                        />
                                    </th>
                                    <th>Projeto / Cliente</th>
                                    <th>Pacote / Documento</th>
                                    <th>Regra Contratual</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filaFaturamento.map(doc => (
                                    <tr key={doc.id} className={selectedDocs.includes(doc.id) ? styles.rowSelected : ''}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={selectedDocs.includes(doc.id)}
                                                onChange={() => handleToggleSelect(doc.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td>
                                            <strong>{doc.projeto}</strong><br />
                                            <span className={styles.muted}>{doc.cliente}</span>
                                        </td>
                                        <td>
                                            <strong>{doc.documento}</strong><br />
                                            <span className={styles.muted}>{doc.pacote}</span>
                                        </td>
                                        <td>
                                            <span className={styles.regra}>{doc.regraFaturamento}</span>
                                        </td>
                                        <td>
                                            <strong>{formatCurrency(doc.valorEstimado)}</strong>
                                        </td>
                                    </tr>
                                ))}
                                {filaFaturamento.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className={styles.emptyState}>Nenhum documento apto a faturar no momento.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.summaryCard}>
                        <h3>Resumo da Solicitação</h3>

                        <div className={styles.summaryRow}>
                            <span>Itens Selecionados</span>
                            <strong>{selectedDocs.length}</strong>
                        </div>

                        <div className={styles.summaryRowTotal}>
                            <span>Valor Total Bruto</span>
                            <strong>{formatCurrency(valorTotalSelecionado)}</strong>
                        </div>

                        <div className={styles.divider}></div>

                        <h4>Checklist Guiado (Financeiro)</h4>
                        <div className={styles.checklist}>
                            <label className={styles.checkItem}>
                                <input type="checkbox" />
                                <span>Validar CNPJ e Dados de Cobrança do(s) cliente(s).</span>
                            </label>
                            <label className={styles.checkItem}>
                                <input type="checkbox" />
                                <span>Anexar relatórios de medição (se medição por hora).</span>
                            </label>
                            <label className={styles.checkItem}>
                                <input type="checkbox" />
                                <span>Confirmar emissão de certidões negativas necessárias.</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Resumo do Rascunho">
                <div className={styles.modalContent}>
                    <div className={styles.draftAlert}>
                        <CheckCircle className={styles.draftIcon} size={24} />
                        <div>
                            <strong>Rascunho gerado com sucesso!</strong>
                            <p>Esta simulação agrupa os itens selecionados por cliente/CNPJ.</p>
                        </div>
                    </div>

                    <div className={styles.draftList}>
                        {filaFaturamento.filter(d => selectedDocs.includes(d.id)).map(doc => (
                            <div key={doc.id} className={styles.draftItem}>
                                <FileText size={20} className={styles.draftItemIcon} />
                                <div className={styles.draftItemDesc}>
                                    <strong>NF Parcial - {doc.cliente}</strong>
                                    <span>{doc.projeto} - Ref: {doc.documento}</span>
                                </div>
                                <div className={styles.draftItemValue}>
                                    {formatCurrency(doc.valorEstimado)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.draftFooter}>
                        <div className={styles.draftTotal}>
                            <span>Total a ser transmitido (SEFAZ mock):</span>
                            <strong>{formatCurrency(valorTotalSelecionado)}</strong>
                        </div>

                        <button className={styles.confirmButton} onClick={confirmarFaturamento}>
                            <Banknote size={16} /> Confirmar e Emitir (Simulação)
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
