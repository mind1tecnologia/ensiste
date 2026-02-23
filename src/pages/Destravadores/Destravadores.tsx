import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { Badge } from '../../components/common/Badge';
import { Mail, AlertOctagon, Anchor, Zap, ToggleLeft, ToggleRight, Clock } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import clsx from 'clsx';
import styles from './Destravadores.module.css';

export const Destravadores = () => {
    const { documentos, setDocumentos, addToast } = useAppContext();
    const [cadenciaAtiva, setCadenciaAtiva] = useState(false);

    // Calcula KPIs
    const valorParadoCliente = documentos
        .filter(d => d.status === 'Aguardando cliente')
        .reduce((acc, doc) => acc + doc.valorEstimado, 0);

    const getAging = (doc: any) => {
        const start = doc.dataEnvio ? parseISO(doc.dataEnvio) : parseISO(doc.dataCriacao);
        const end = doc.dataRetorno ? parseISO(doc.dataRetorno) : new Date();
        return Math.max(0, differenceInDays(end, start));
    };

    const itensCriticos = documentos.filter(d => getAging(d) > 7 && d.status !== 'Apto a faturar' && d.status !== 'Aprovado' && d.status !== 'Faturado').length;

    const aptoHojeValor = documentos
        .filter(d => d.status === 'Apto a faturar')
        .reduce((acc, doc) => acc + doc.valorEstimado, 0);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const filaAcoes = [...documentos]
        .filter(d => d.status === 'Aguardando cliente' || d.status === 'Reprovado / Necessita ajuste')
        .map(d => ({ ...d, aging: getAging(d) }))
        .sort((a, b) => b.aging - a.aging)
        .slice(0, 5);

    const handleAcaoSimulada = (id: string, tipo: 'follow-up' | 'escalar') => {
        setDocumentos(prevDocs => prevDocs.map(d => {
            if (d.id === id) {
                const desc = tipo === 'follow-up'
                    ? "Follow-up automático enviado ao cliente via e-mail."
                    : "Item escalonado para a coordenação para intervenção manual com o cliente.";
                const historyEvent = {
                    id: Math.random().toString(36).substr(2, 9),
                    dataHora: new Date().toISOString(),
                    descricao: desc,
                    responsavel: "Sistema (Automação)"
                };
                return {
                    ...d,
                    historico: [...d.historico, historyEvent]
                };
            }
            return d;
        }));
        addToast({ message: `Ação "${tipo}" disparada com sucesso! Histórico atualizado.`, type: "success" });
    };

    const handleToggleCadencia = () => {
        const newVal = !cadenciaAtiva;
        setCadenciaAtiva(newVal);
        if (newVal) {
            addToast({ message: "Cadência automática ATIVADA. O sistema passará a seguir as regras de dias.", type: "success" });
            setTimeout(() => {
                addToast({ message: "O sistema detectou 2 itens parados há >7 dias e disparou escalonamentos.", type: "warning", duration: 6000 });
            }, 1500);
        } else {
            addToast({ message: "Cadência automática DESATIVADA.", type: "info" });
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Destravadores do Caixa</h1>
                    <p className={styles.pageSubtitle}>Acelere recebimentos com automações de follow-up focadas nos gargalos.</p>
                </div>
            </header>

            <section className={styles.kpiGrid}>
                <KpiCard
                    title="Parado com Cliente"
                    value={formatCurrency(valorParadoCliente)}
                    subtitle="Capital retido externamente"
                    icon={<Anchor size={24} />}
                    highlight="warning"
                />
                <KpiCard
                    title="Itens Críticos (>7 dias)"
                    value={itensCriticos}
                    subtitle="Documentos estagnados"
                    icon={<AlertOctagon size={24} />}
                    highlight="danger"
                />
                <KpiCard
                    title="Disponível para Faturar Hoje"
                    value={formatCurrency(aptoHojeValor)}
                    subtitle="Valor a ser resgatado"
                    icon={<Zap size={24} />}
                    highlight="success"
                />
            </section>

            <div className={styles.layoutGrid}>
                <div className={styles.mainColumn}>
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <h3>Fila de Ações Imediatas (Quick-Wins)</h3>
                            <span className={styles.subtitle}>Priorizado por maior aging em cliente.</span>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Cod / Doc</th>
                                    <th>Status atual</th>
                                    <th>Aging</th>
                                    <th>Valor Parado</th>
                                    <th>Ações de Destrave (Demo)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filaAcoes.map(doc => (
                                    <tr key={doc.id}>
                                        <td>
                                            <strong>{doc.documento}</strong><br />
                                            <span className={styles.muted}>{doc.projeto} / {doc.cliente}</span>
                                        </td>
                                        <td><Badge type="status" value={doc.status} /></td>
                                        <td>
                                            <div className={clsx(styles.agingPill, doc.aging > 7 ? styles.agingDanger : styles.agingWarning)}>
                                                <Clock size={12} /> {doc.aging}d
                                            </div>
                                        </td>
                                        <td><strong>{formatCurrency(doc.valorEstimado)}</strong></td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button
                                                    className={clsx(styles.actionBtn, styles.btnFollow)}
                                                    onClick={() => handleAcaoSimulada(doc.id, 'follow-up')}
                                                >
                                                    <Mail size={16} /> Follow-up
                                                </button>
                                                <button
                                                    className={clsx(styles.actionBtn, styles.btnEscalate)}
                                                    onClick={() => handleAcaoSimulada(doc.id, 'escalar')}
                                                >
                                                    <AlertOctagon size={16} /> Escalar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filaAcoes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className={styles.emptyState}>Nenhuma ação imediata pendente.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.cadenceCard}>
                        <div className={styles.cadenceHeader}>
                            <h3>Cadência Automática</h3>
                            <button
                                className={clsx(styles.toggleBtn, cadenciaAtiva && styles.toggleActive)}
                                onClick={handleToggleCadencia}
                            >
                                {cadenciaAtiva ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>

                        <p className={styles.cadenceDesc}>
                            Regras do motor de automação baseadas no "Aging" de um documento na mão do cliente:
                        </p>

                        <div className={styles.rulesList}>
                            <div className={styles.ruleItem}>
                                <div className={styles.ruleDay}>3 dias</div>
                                <div className={styles.ruleContent}>
                                    <strong>Follow-up Simples</strong>
                                    <span>Email automático para o ponto focal do cliente lembrando do prazo.</span>
                                </div>
                            </div>

                            <div className={styles.ruleItem}>
                                <div className={styles.ruleDayWarning}>7 dias</div>
                                <div className={styles.ruleContent}>
                                    <strong>Escalonamento (Coordenação)</strong>
                                    <span>Aviso à coordenação interna para ligação com engenharia do cliente.</span>
                                </div>
                            </div>

                            <div className={styles.ruleItem}>
                                <div className={styles.ruleDayDanger}>10+ dias</div>
                                <div className={styles.ruleContent}>
                                    <strong>Escalonamento Direto (Diretoria)</strong>
                                    <span>Destaque no cockpit executivo e notificação gerencial por quebra de SLA.</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statusBox}>
                            Status atual: <strong>{cadenciaAtiva ? "RODANDO" : "PAUSADO (Manual)"}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
