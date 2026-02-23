import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, LayoutDashboard, KanbanSquare, Zap, Bot, ChevronRight, CheckCircle2 } from 'lucide-react';
import styles from './Home.module.css';

export const Home = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);

    const steps = [
        {
            id: 1,
            title: "1. Fonte Única da Verdade",
            desc: "Todos os entregáveis (projetos, pacotes, documentos) mapeados com status, responsáveis e prazos reais em um único lugar.",
            icon: <CheckCircle2 size={24} />
        },
        {
            id: 2,
            title: "2. Estados & KPIs",
            desc: "Cockpits focados: O Executivo vê a margem e o caixa retido. O Operacional gerencia a fila e os bloqueios diários.",
            icon: <LayoutDashboard size={24} />
        },
        {
            id: 3,
            title: "3. Automações de Fluxo",
            desc: "O sistema cobra ativamente os responsáveis e escala impasses sem intervenção humana, reduzindo o tempo de ciclo.",
            icon: <Zap size={24} />
        },
        {
            id: 4,
            title: "4. Inteligência Artificial",
            desc: "A IA categoriza motivos de retrabalho, sugere checklist de correção e escreve resumos executivos.",
            icon: <Bot size={24} />
        }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <div className={styles.logoBadge}>PROTÓTIPO</div>
                <h1 className={styles.title}>Bem-vindo ao Novo Padrão Operacional ENSISTE</h1>
                <p className={styles.subtitle}>
                    Uma plataforma focada em destravar o caixa, reduzir retrabalho e dar visibilidade total
                    através da gestão inteligente de entregáveis.
                </p>
            </header>

            <div className={styles.tourSection}>
                <div className={styles.tourHeader}>
                    <h2>Tour Guiado: Como funciona?</h2>
                </div>

                <div className={styles.stepsContainer}>
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={activeStep === step.id ? styles.stepActive : styles.stepCard}
                            onClick={() => setActiveStep(step.id)}
                        >
                            <div className={styles.stepIcon}>{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.actionsSection}>
                <h2>Explore os Módulos</h2>
                <div className={styles.modulesGrid}>
                    <button className={styles.moduleCard} onClick={() => navigate('/executivo')}>
                        <LayoutDashboard size={32} className={styles.moduleIcon} />
                        <div className={styles.moduleText}>
                            <h3>Cockpit Executivo</h3>
                            <p>Visão de diretoria sobre faturamento, caixa parado e margem.</p>
                        </div>
                        <ChevronRight size={20} className={styles.arrowIcon} />
                    </button>

                    <button className={styles.moduleCard} onClick={() => navigate('/operacional')}>
                        <KanbanSquare size={32} className={styles.moduleIcon} />
                        <div className={styles.moduleText}>
                            <h3>Cockpit Operacional</h3>
                            <p>Priorização de fila, kanban e gestão de bloqueios do dia a dia.</p>
                        </div>
                        <ChevronRight size={20} className={styles.arrowIcon} />
                    </button>

                    <button className={styles.moduleCard} onClick={() => navigate('/destravadores')}>
                        <Zap size={32} className={styles.moduleIcon} />
                        <div className={styles.moduleText}>
                            <h3>Destravadores de Caixa</h3>
                            <p>Automações de follow-up e cadência de cobrança de clientes.</p>
                        </div>
                        <ChevronRight size={20} className={styles.arrowIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};
