import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { DollarSign, Clock, AlertCircle, Bot, CheckCircle } from 'lucide-react';
import styles from './Executivo.module.css';

export const Executivo = () => {
    const { documentos, addToast } = useAppContext();
    const [isIaModalOpen, setIsIaModalOpen] = useState(false);

    // Calcula KPIs
    const faturamentoRealizado = 350000; // Mock fixo para faturado no mês
    const previstoMes = 500000; // Mock fixo

    const valorParado = documentos
        .filter(d => ['Aguardando cliente', 'Reprovado / Necessita ajuste'].includes(d.status))
        .reduce((acc, doc) => acc + doc.valorEstimado, 0);

    const aptoFaturar = documentos
        .filter(d => d.status === 'Apto a faturar')
        .reduce((acc, doc) => acc + doc.valorEstimado, 0);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const handleGerarResumo = () => {
        addToast({ message: "Analisando 12 documentos e histórico de interações...", type: "info" });
        setTimeout(() => {
            setIsIaModalOpen(true);
        }, 1500);
    };

    // Mock de tabelas
    const topTravas = documentos
        .filter(d => d.bloqueio)
        .sort((a, b) => b.valorEstimado - a.valorEstimado)
        .slice(0, 3);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Cockpit Executivo</h1>
                    <p className={styles.pageSubtitle}>Visão consolidada de caixa e operação.</p>
                </div>
                <button className={styles.iaButton} onClick={handleGerarResumo}>
                    <Bot size={20} />
                    Gerar resumo com IA (demo)
                </button>
            </header>

            <section className={styles.kpiGrid}>
                <KpiCard
                    title="Faturamento Mês"
                    value={formatCurrency(faturamentoRealizado)}
                    subtitle={`Meta: ${formatCurrency(previstoMes)}`}
                    icon={<DollarSign size={24} />}
                    trend={{ value: "70%", isPositive: true }}
                    highlight="success"
                />
                <KpiCard
                    title="Valor Parado (Bloqueios)"
                    value={formatCurrency(valorParado)}
                    subtitle="Aguardando ação ou cliente"
                    icon={<AlertCircle size={24} />}
                    trend={{ value: "+12%", isPositive: false }}
                    highlight="danger"
                />
                <KpiCard
                    title="Apto a Faturar (Desbloqueado)"
                    value={formatCurrency(aptoFaturar)}
                    subtitle="Pronto para emissão de NFe"
                    icon={<CheckCircle size={24} />}
                    highlight="info"
                />
                <KpiCard
                    title="Margem Operacional"
                    value="42%"
                    subtitle="Média dos projetos ativos"
                    icon={<DollarSign size={24} />}
                    trend={{ value: "2%", isPositive: true }}
                />
            </section>

            <div className={styles.tablesContainer}>
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3>Top Travas (Valor em Risco)</h3>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Projeto</th>
                                <th>Bloqueio Atual</th>
                                <th>Responsável / Gargalo</th>
                                <th className={styles.textRight}>Valor Parado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topTravas.map(doc => (
                                <tr key={doc.id}>
                                    <td><strong>{doc.projeto}</strong><br /><span className={styles.muted}>{doc.documento}</span></td>
                                    <td>
                                        <Badge type="status" value={doc.status} />
                                        <div className={styles.blockReason}>{doc.bloqueio}</div>
                                    </td>
                                    <td>{doc.responsavel}</td>
                                    <td className={styles.textRight}><strong>{formatCurrency(doc.valorEstimado)}</strong></td>
                                </tr>
                            ))}
                            {topTravas.length === 0 && (
                                <tr>
                                    <td colSpan={4} className={styles.emptyState}>Nenhuma trava crítica identificada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3>Valor Parado por Fase</h3>
                    </div>
                    <div className={styles.phaseChart}>
                        <div className={styles.phaseRow}>
                            <div className={styles.phaseInfo}>
                                <span>Aguardando Cliente</span>
                                <strong>{formatCurrency(410000)}</strong>
                            </div>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '65%', backgroundColor: 'var(--warning)' }}></div></div>
                        </div>
                        <div className={styles.phaseRow}>
                            <div className={styles.phaseInfo}>
                                <span>Em Revisão Interna</span>
                                <strong>{formatCurrency(142000)}</strong>
                            </div>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '25%', backgroundColor: 'var(--info)' }}></div></div>
                        </div>
                        <div className={styles.phaseRow}>
                            <div className={styles.phaseInfo}>
                                <span>Reprovado / Ajuste</span>
                                <strong>{formatCurrency(83000)}</strong>
                            </div>
                            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '15%', backgroundColor: 'var(--danger)' }}></div></div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isIaModalOpen}
                onClose={() => setIsIaModalOpen(false)}
                title="Resumo Executivo (IA)"
                isIA
            >
                <div className={styles.iaModalContent}>
                    <p className={styles.iaContext}>
                        Analisamos os movimentos da última semana em todos os 12 documentos da base de demonstração. Aqui estão os principais insights para a diretoria:
                    </p>

                    <div className={styles.iaSection}>
                        <h4>🔥 Principais Insights</h4>
                        <ul className={styles.iaList}>
                            <li>O montante "Apto a faturar" cresceu em <strong>R$ 210.000</strong> com a aprovação do projeto PCH Caju.</li>
                            <li>Temos <strong>R$ 83.000</strong> retidos em retrabalho (UTE TermoCerrado). O principal motivo é falha na interpretação de normas ASME vs API.</li>
                            <li>O projeto "Linha de Transmissão 500kV" está parado há mais de 10 dias aguardando dados topográficos do cliente, travando R$ 120.000.</li>
                        </ul>
                    </div>

                    <div className={styles.iaSection}>
                        <h4>💡 Recomendações de Ação</h4>
                        <div className={styles.iaActionCard}>
                            <strong>1. Faturar imediatamente o PCH Caju.</strong>
                            <p>O documento "Memória de Cálculo Vertedouro" foi aprovado sem ressalvas. O fluxo financeiro já pode ser iniciado.</p>
                        </div>
                        <div className={styles.iaActionCard}>
                            <strong>2. Escalonar UTE TermoCerrado.</strong>
                            <p>O responsável Roberto Mendes deve acionar a coordenação para alinhar a divergência de normas junto ao cliente.</p>
                        </div>
                        <div className={styles.iaActionCard}>
                            <strong>3. Disparar Cadência para EletroRede.</strong>
                            <p>Ativar o destravador automático ("Aguardando parâmetros da subestação") para cobrar o cliente antes do fim do mês.</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
