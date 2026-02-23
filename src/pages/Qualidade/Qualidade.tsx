import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { Modal } from '../../components/common/Modal';
import { ShieldAlert, BookOpen, Bot, TrendingDown, Target } from 'lucide-react';
import styles from './Qualidade.module.css';

export const Qualidade = () => {
    const { documentos, addToast } = useAppContext();
    const [isIaModalOpen, setIsIaModalOpen] = useState(false);

    // KPIs Fictícios para o Dash
    const kpiFTR = "82%"; // First Time Right
    const kpiReenvios = "18%";

    const handleAIAssistant = () => {
        addToast({ message: "Analisando 23 retornos de clientes recentes...", type: "info" });
        setTimeout(() => {
            setIsIaModalOpen(true);
        }, 1200);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Qualidade & Retrabalho</h1>
                    <p className={styles.pageSubtitle}>Identificação de causas raízes e blindagem contra erros repetitivos.</p>
                </div>
                <button className={styles.iaButton} onClick={handleAIAssistant}>
                    <Bot size={18} /> IA: Classificar Causas (Demo)
                </button>
            </header>

            <section className={styles.kpiGrid}>
                <KpiCard
                    title="FTR (Aprov. Primeira Vez)"
                    value={kpiFTR}
                    subtitle="Meta: 90%"
                    icon={<Target size={24} />}
                    trend={{ value: "2%", isPositive: true }}
                    highlight="success"
                />
                <KpiCard
                    title="Índice de Retrabalho (Reenvios)"
                    value={kpiReenvios}
                    subtitle="Média ponderada do mês"
                    icon={<TrendingDown size={24} />}
                    trend={{ value: "1.5%", isPositive: false }}
                    highlight="danger"
                />
                <KpiCard
                    title="Horas Desperdiçadas"
                    value="145h"
                    subtitle="Estimativa do último ciclo"
                    icon={<ShieldAlert size={24} />}
                    highlight="warning"
                />
            </section>

            <div className={styles.layoutGrid}>
                <div className={styles.mainColumn}>
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <h3>Top Motivos de Retenção (Taxonomia)</h3>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Motivo Estruturado</th>
                                    <th>Impacto (% das falhas)</th>
                                    <th>Disciplina Ofensor</th>
                                    <th>Solução Ativa?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Erro de cálculo / Premissa errada</strong></td>
                                    <td>35%</td>
                                    <td>Mecânica</td>
                                    <td><span className={styles.statusActive}>Sim (Valid. Tripla)</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Incompatibilidade c/ outras engenharias</strong></td>
                                    <td>28%</td>
                                    <td>Tubulação / Elétrica</td>
                                    <td><span className={styles.statusActive}>Sim (BIM Clash)</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Desvio de Padrão Flex/Template</strong></td>
                                    <td>15%</td>
                                    <td>Civil</td>
                                    <td><span className={styles.statusPending}>Em estruturação</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Falta de detalhamento (Lista Materiais)</strong></td>
                                    <td>12%</td>
                                    <td>Automação</td>
                                    <td><span className={styles.statusActive}>Checklist OBR</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Change Order (Alteração pelo Cliente)</strong></td>
                                    <td>10%</td>
                                    <td>-</td>
                                    <td><span className={styles.statusPending}>Revisão Contratual</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.libraryCard}>
                        <div className={styles.libraryHeader}>
                            <BookOpen size={20} className={styles.libraryIcon} />
                            <h3>Biblioteca de Padrões (Evitar Erro)</h3>
                        </div>

                        <div className={styles.libraryItem}>
                            <strong>Erro: Padrão ASME vs API</strong>
                            <p>Muitos isométricos de Tubulação reprovados pelo BiolGas Brasil devido a falha de normatização.</p>
                            <div className={styles.libraryFix}>
                                <span>Solução Adotada:</span>
                                Item no checklist forçando validadores a comparar a N-1250 (ASME) vs N-1300 (API) antes da emissão.
                            </div>
                        </div>

                        <div className={styles.libraryItem}>
                            <strong>Erro: Assinatura Eletrônica Faltante</strong>
                            <p>EnergyCorp rejeitou 3 pacotes seguidos (Fundações) por quebra de governança na RT.</p>
                            <div className={styles.libraryFix}>
                                <span>Solução Adotada:</span>
                                Automação verifica o hash do PDF antes de disparar email de Envio ao Cliente.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isIaModalOpen} onClose={() => setIsIaModalOpen(false)} title="Análise de Causa (IA)" isIA>
                <div className={styles.iaModalContent}>
                    <p className={styles.iaContext}>
                        Varredura realizada em e-mails e atas de reunião (mock) dos últimos 10 projetos com FTR abaixo de 80%.
                    </p>

                    <div className={styles.iaSection}>
                        <h4>Diagnóstico</h4>
                        <p>
                            Foi detectado que <strong>40% dos comentários de reprovação</strong> do cliente "BioGas Brasil" não são de engenharia core, e sim relacionados ao uso de carimbos desatualizados da revisão Rev.B do template de Folha de Dados.
                        </p>
                    </div>

                    <div className={styles.iaSection}>
                        <h4>Sugestão de Prevenção</h4>
                        <div className={styles.iaFixContainer}>
                            <strong>Criar Regra de Bloqueio (Checklist Inteligente):</strong>
                            <p>Adicionar automaticamente a verificação "Confirmar versão do template - Rev.C (2024)" em <strong>TODOS</strong> os pacotes do cliente BioGas Brasil.</p>
                            <button className={styles.iaActionButton} onClick={() => setIsIaModalOpen(false)}>
                                Injetar regra no Cliente (BioGas Brasil)
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
