import React from 'react';
import { Bot, Zap, Clock, ShieldCheck, Mail, FileText, CheckCircle2 } from 'lucide-react';
import styles from './Automacoes.module.css';

export const Automacoes = () => {
    const automations = [
        {
            id: 1,
            title: "Resumo Executivo (IA)",
            icon: <Bot size={24} />,
            trigger: "Ação manual no Cockpit Executivo ou agendamento semanal.",
            action: "Analisa o histórico de todos os documentos ativos e cruza com regras de negócios para escrever um parágrafo narrativo.",
            impact: "Economiza 4h semanais de consolidação de dados pela diretoria."
        },
        {
            id: 2,
            title: "Cadência de Follow-up (Auto)",
            icon: <Mail size={24} />,
            trigger: "Quando um documento atinge 3 dias no status 'Aguardando cliente'.",
            action: "Dispara um e-mail com template padrão e o anexo correspondente cobrando aprovação do cliente.",
            impact: "Reduz o aging médio em clientes de 12 para 5 dias."
        },
        {
            id: 3,
            title: "Escalonamento por Aging",
            icon: <Clock size={24} />,
            trigger: "Quando um item de prioridade Alta atinge 7 dias sem movimentação.",
            action: "Notifica a coordenação via Teams/Email e altera automaticamente a prioridade visual no Cockpit Operacional.",
            impact: "Evita que documentos críticos fiquem esquecidos na fila."
        },
        {
            id: 4,
            title: "Classificação de Retrabalho (IA)",
            icon: <Bot size={24} />,
            trigger: "Cliente rejeita um documento enviando comentários textuais.",
            action: "A IA lê os comentários, categoriza no banco de taxonomia (ex: 'Erro de cálculo') e aciona a Qualidade.",
            impact: "Mapeamento em tempo real das falhas estruturais da engenharia sem intervenção humana."
        },
        {
            id: 5,
            title: "Checklist Inteligente",
            icon: <ShieldCheck size={24} />,
            trigger: "Mudança estrutural em regras de Padrões (Biblioteca de Qualidade).",
            action: "Injeta novos itens de checklist obrigatoriamente para projetos de mesmo perfil ou cliente.",
            impact: "Blindagem de Qualidade: o erro não se repete no próximo ciclo."
        },
        {
            id: 6,
            title: "Esteira de Faturamento",
            icon: <Zap size={24} />,
            trigger: "Quando um marco contratual é atingido (ex: Documento vai para 'Aprovado').",
            action: "Se a regra contratual for atendida, move o documento para 'Apto a faturar' e cria o card no app do Financeiro.",
            impact: "O caixa deixa de ficar retido por gap de comunicação entre Engenharia e Administrativo."
        }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Central de Automações & IA</h1>
                    <p className={styles.pageSubtitle}>Catálogo das regras de negócio ativas que reduzem o atrito operacional e blindam a qualidade.</p>
                </div>
            </header>

            <div className={styles.infoBanner}>
                <CheckCircle2 className={styles.infoIcon} size={24} />
                <div>
                    <strong>Nota de Demonstração</strong>
                    <p>No protótipo atual, estas automações são simuladas via Toasts e atualizações de estado local na interface,
                        demonstrando a proposta de valor arquitetural.</p>
                </div>
            </div>

            <div className={styles.grid}>
                {automations.map(auto => (
                    <div key={auto.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>{auto.icon}</div>
                            <h3>{auto.title}</h3>
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.item}>
                                <span className={styles.label}>Quando dispara:</span>
                                <p>{auto.trigger}</p>
                            </div>

                            <div className={styles.item}>
                                <span className={styles.label}>O que faz:</span>
                                <p>{auto.action}</p>
                            </div>

                            <div className={styles.itemImpact}>
                                <span className={styles.labelImpact}>Impacto (Business Case):</span>
                                <p>{auto.impact}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
