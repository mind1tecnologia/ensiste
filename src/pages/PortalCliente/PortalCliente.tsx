import React, { FormEvent, useEffect, useState } from 'react';
import {
    AlertTriangle,
    ArrowRight,
    Building2,
    CalendarClock,
    CheckCircle2,
    CreditCard,
    FileText,
    FolderKanban,
    LogOut,
    Wallet,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { Badge } from '../../components/common/Badge';
import { portalClienteLdData } from '../../data/portalClienteLdData';
import logoEnsiste from '../../assets/ensiste-logo-anexo.png';
import { Documento } from '../../types';
import { PortalClienteLdSection } from './PortalClienteLdSection';
import styles from './PortalCliente.module.css';

type ProjetoSaude = 'No prazo' | 'Atenção' | 'Crítico' | 'Concluído';
type FaturaStatus = 'Pago' | 'Parcial' | 'Em aberto' | 'Atrasado' | 'Programado';

interface ProjetoCliente {
    id: string;
    nome: string;
    status: ProjetoSaude;
    valorContrato: number;
    valorFaturado: number;
    valorRecebido: number;
    fisicoPlanejado: number;
    fisicoReal: number;
    financeiroPlanejado: number;
    financeiroReal: number;
    ultimoMarco: string;
    proximoMarco: string;
    atualizadoEm: string;
}

interface FaturaCliente {
    id: string;
    projeto: string;
    descricao: string;
    competencia: string;
    vencimento: string;
    valor: number;
    valorPago: number;
    status: FaturaStatus;
}

interface UsuarioPortal {
    id: string;
    empresa: string;
    contato: string;
    email: string;
    senha: string;
    perfil: string;
    cnpjMascara: string;
    contratosAtivos: number;
    projetos: ProjetoCliente[];
    faturas: FaturaCliente[];
}

const PORTAL_STORAGE_KEY = 'ensiste.portal-cliente.session';

const usuariosPortal: UsuarioPortal[] = [
    {
        id: 'energycorp',
        empresa: 'EnergyCorp',
        contato: 'Paula M. Souza',
        email: 'cliente@energycorp.demo',
        senha: 'demo123',
        perfil: 'Gerente de Implantação',
        cnpjMascara: '12.345.678/0001-90',
        contratosAtivos: 2,
        projetos: [
            {
                id: 'proj-pch-caju',
                nome: 'PCH Caju',
                status: 'Atenção',
                valorContrato: 1450000,
                valorFaturado: 930000,
                valorRecebido: 780000,
                fisicoPlanejado: 72,
                fisicoReal: 68,
                financeiroPlanejado: 65,
                financeiroReal: 61,
                ultimoMarco: 'Memória de Cálculo Vertedouro aprovada',
                proximoMarco: 'Entrega executivo da Casa de Força (R1)',
                atualizadoEm: '2026-02-20',
            },
            {
                id: 'proj-pch-caju-exp',
                nome: 'PCH Caju - Estudos Complementares',
                status: 'No prazo',
                valorContrato: 380000,
                valorFaturado: 170000,
                valorRecebido: 170000,
                fisicoPlanejado: 41,
                fisicoReal: 44,
                financeiroPlanejado: 39,
                financeiroReal: 45,
                ultimoMarco: 'Relatório de inspeção geotécnica entregue',
                proximoMarco: 'Parecer final de fundações',
                atualizadoEm: '2026-02-18',
            },
        ],
        faturas: [
            {
                id: 'fat-ec-001',
                projeto: 'PCH Caju',
                descricao: 'Marco 03 - Entrega Estruturas Barragem',
                competencia: 'Jan/2026',
                vencimento: '2026-02-05',
                valor: 210000,
                valorPago: 210000,
                status: 'Pago',
            },
            {
                id: 'fat-ec-002',
                projeto: 'PCH Caju',
                descricao: 'Marco 04 - Casa de Força (parcial)',
                competencia: 'Fev/2026',
                vencimento: '2026-02-20',
                valor: 180000,
                valorPago: 90000,
                status: 'Parcial',
            },
            {
                id: 'fat-ec-003',
                projeto: 'PCH Caju',
                descricao: 'Revisão complementar de fundações',
                competencia: 'Fev/2026',
                vencimento: '2026-02-14',
                valor: 65000,
                valorPago: 0,
                status: 'Atrasado',
            },
            {
                id: 'fat-ec-004',
                projeto: 'PCH Caju - Estudos Complementares',
                descricao: 'Medição mensal de horas (fechamento)',
                competencia: 'Mar/2026',
                vencimento: '2026-03-10',
                valor: 78000,
                valorPago: 0,
                status: 'Programado',
            },
        ],
    },
    {
        id: 'transmissora-sul',
        empresa: 'Transmissora Sul',
        contato: 'Ricardo Tavares',
        email: 'cliente@transmissorasul.demo',
        senha: 'demo123',
        perfil: 'Coordenador de Engenharia',
        cnpjMascara: '98.765.432/0001-12',
        contratosAtivos: 1,
        projetos: [
            {
                id: 'proj-se-230',
                nome: 'Subestação 230kV',
                status: 'No prazo',
                valorContrato: 2120000,
                valorFaturado: 1240000,
                valorRecebido: 1090000,
                fisicoPlanejado: 58,
                fisicoReal: 60,
                financeiroPlanejado: 55,
                financeiroReal: 58,
                ultimoMarco: 'Arranjo físico consolidado',
                proximoMarco: 'SPCS e painéis - revisão R0',
                atualizadoEm: '2026-02-21',
            },
        ],
        faturas: [
            {
                id: 'fat-ts-001',
                projeto: 'Subestação 230kV',
                descricao: 'Marco 02 - Arranjo físico',
                competencia: 'Jan/2026',
                vencimento: '2026-01-31',
                valor: 340000,
                valorPago: 340000,
                status: 'Pago',
            },
            {
                id: 'fat-ts-002',
                projeto: 'Subestação 230kV',
                descricao: 'Marco 03 - Diagramas preliminares',
                competencia: 'Fev/2026',
                vencimento: '2026-02-28',
                valor: 295000,
                valorPago: 0,
                status: 'Em aberto',
            },
            {
                id: 'fat-ts-003',
                projeto: 'Subestação 230kV',
                descricao: 'Horas adicionais aprovadas',
                competencia: 'Mar/2026',
                vencimento: '2026-03-18',
                valor: 42000,
                valorPago: 0,
                status: 'Programado',
            },
        ],
    },
    {
        id: 'biogas-brasil',
        empresa: 'BioGas Brasil',
        contato: 'Amanda P. Nogueira',
        email: 'cliente@biogasbrasil.demo',
        senha: 'demo123',
        perfil: 'Engenharia do Proprietário',
        cnpjMascara: '11.222.333/0001-44',
        contratosAtivos: 1,
        projetos: [
            {
                id: 'proj-ute-tc',
                nome: 'UTE TermoCerrado',
                status: 'Crítico',
                valorContrato: 980000,
                valorFaturado: 420000,
                valorRecebido: 260000,
                fisicoPlanejado: 64,
                fisicoReal: 49,
                financeiroPlanejado: 60,
                financeiroReal: 43,
                ultimoMarco: 'Relatório de proteção enviado com ressalvas',
                proximoMarco: 'Reentrega Isométricos linha principal',
                atualizadoEm: '2026-02-19',
            },
        ],
        faturas: [
            {
                id: 'fat-bg-001',
                projeto: 'UTE TermoCerrado',
                descricao: 'Marco 01 - Kickoff e premissas',
                competencia: 'Dez/2025',
                vencimento: '2026-01-10',
                valor: 180000,
                valorPago: 180000,
                status: 'Pago',
            },
            {
                id: 'fat-bg-002',
                projeto: 'UTE TermoCerrado',
                descricao: 'Marco 02 - Modelagem mecânica (parcial)',
                competencia: 'Fev/2026',
                vencimento: '2026-02-12',
                valor: 140000,
                valorPago: 50000,
                status: 'Parcial',
            },
            {
                id: 'fat-bg-003',
                projeto: 'UTE TermoCerrado',
                descricao: 'Retrabalho extraordinário contratado',
                competencia: 'Fev/2026',
                vencimento: '2026-02-17',
                valor: 76000,
                valorPago: 0,
                status: 'Atrasado',
            },
            {
                id: 'fat-bg-004',
                projeto: 'UTE TermoCerrado',
                descricao: 'Marco 03 - Reentrega pacote tubulação',
                competencia: 'Mar/2026',
                vencimento: '2026-03-25',
                valor: 210000,
                valorPago: 0,
                status: 'Programado',
            },
        ],
    },
];

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR');

const formatMoney = (value: number) => currencyFormatter.format(value);
const formatDate = (value: string) => dateFormatter.format(new Date(`${value}T00:00:00`));
const formatIsoDateTime = (value: string) => new Date(value).toLocaleDateString('pt-BR');

const getProjetoStatusClass = (status: ProjetoSaude) => {
    switch (status) {
        case 'Concluído':
            return styles.pillSuccess;
        case 'No prazo':
            return styles.pillInfo;
        case 'Atenção':
            return styles.pillWarning;
        case 'Crítico':
            return styles.pillDanger;
    }
};

const getFaturaStatusClass = (status: FaturaStatus) => {
    switch (status) {
        case 'Pago':
            return styles.pillSuccess;
        case 'Parcial':
            return styles.pillWarning;
        case 'Atrasado':
            return styles.pillDanger;
        case 'Programado':
            return styles.pillInfo;
        case 'Em aberto':
            return styles.pillNeutral;
    }
};

const percentualCumprimento = (real: number, planejado: number) => {
    if (planejado <= 0) return 100;
    return Math.round((real / planejado) * 100);
};

const calcularStatusDocumentos = (documentos: Documento[]) => {
    const counters: Record<string, number> = {};
    for (const doc of documentos) {
        counters[doc.status] = (counters[doc.status] || 0) + 1;
    }
    return counters;
};

export const PortalCliente = () => {
    const { documentos } = useAppContext();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroLogin, setErroLogin] = useState('');
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [buscaDocumento, setBuscaDocumento] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = window.localStorage.getItem(PORTAL_STORAGE_KEY);
        if (!saved) return;
        setSessionUserId(saved);
        const user = usuariosPortal.find((item) => item.id === saved);
        if (user) {
            setEmail(user.email);
            setSenha(user.senha);
        }
    }, []);

    const usuarioLogado = usuariosPortal.find((user) => user.id === sessionUserId) ?? null;
    const dataReferencia = new Date();

    const handleLogin = (event: FormEvent) => {
        event.preventDefault();
        setErroLogin('');

        const user = usuariosPortal.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
        if (!user || user.senha !== senha.trim()) {
            setErroLogin('Credenciais demo inválidas. Use um dos acessos rápidos abaixo.');
            return;
        }

        setSessionUserId(user.id);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(PORTAL_STORAGE_KEY, user.id);
        }
    };

    const handleQuickLogin = (user: UsuarioPortal) => {
        setEmail(user.email);
        setSenha(user.senha);
        setErroLogin('');
        setSessionUserId(user.id);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(PORTAL_STORAGE_KEY, user.id);
        }
    };

    const handleLogout = () => {
        setSessionUserId(null);
        setErroLogin('');
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(PORTAL_STORAGE_KEY);
        }
    };

    if (!usuarioLogado) {
        return (
            <div className={styles.page}>
                <div className={styles.loginShell}>
                    <section className={styles.loginHero}>
                        <img src={logoEnsiste} alt="Ensiste Grupo im3" className={styles.loginLogo} />
                        <span className={styles.loginEyebrow}>Portal do Cliente (Demo)</span>
                        <h1 className={styles.loginTitle}>Acompanhe projeto, documentos e faturamento em tempo real</h1>
                        <p className={styles.loginSubtitle}>
                            Ambiente demonstrativo para clientes da Ensiste com visibilidade do avanço físico e financeiro,
                            status documental e agenda de pagamentos.
                        </p>

                        <div className={styles.loginFeatures}>
                            <div className={styles.featureCard}>
                                <FolderKanban size={18} />
                                Status de projetos e marcos
                            </div>
                            <div className={styles.featureCard}>
                                <FileText size={18} />
                                Situação de documentos por pacote
                            </div>
                            <div className={styles.featureCard}>
                                <Wallet size={18} />
                                Faturas pagas, em aberto e atrasadas
                            </div>
                        </div>
                    </section>

                    <section className={styles.loginCard}>
                        <div className={styles.loginCardHeader}>
                            <h2>Login virtual</h2>
                            <p>Use os acessos de demonstração para visualizar diferentes clientes.</p>
                        </div>

                        <form className={styles.loginForm} onSubmit={handleLogin}>
                            <label className={styles.field}>
                                <span>E-mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="cliente@empresa.demo"
                                    autoComplete="email"
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Senha</span>
                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="demo123"
                                    autoComplete="current-password"
                                />
                            </label>

                            {erroLogin && (
                                <div className={styles.loginError}>
                                    <AlertTriangle size={16} />
                                    <span>{erroLogin}</span>
                                </div>
                            )}

                            <button type="submit" className={styles.primaryButton}>
                                Entrar no Portal
                                <ArrowRight size={16} />
                            </button>
                        </form>

                        <div className={styles.quickAccessBlock}>
                            <span className={styles.quickAccessLabel}>Acessos rápidos (demo)</span>
                            <div className={styles.quickAccessList}>
                                {usuariosPortal.map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className={styles.quickAccessItem}
                                        onClick={() => handleQuickLogin(user)}
                                    >
                                        <div>
                                            <strong>{user.empresa}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                        <small>senha: {user.senha}</small>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    const documentosCliente = documentos.filter((doc) => doc.cliente === usuarioLogado.empresa);
    const termoBusca = buscaDocumento.trim().toLowerCase();
    const documentosFiltrados = documentosCliente.filter((doc) => {
        if (!termoBusca) return true;
        return (
            doc.documento.toLowerCase().includes(termoBusca) ||
            doc.projeto.toLowerCase().includes(termoBusca) ||
            doc.disciplina.toLowerCase().includes(termoBusca) ||
            doc.pacote.toLowerCase().includes(termoBusca)
        );
    });

    const documentosPorStatus = calcularStatusDocumentos(documentosCliente);
    const totalDocumentos = documentosCliente.length;
    const documentosPendentesCliente =
        (documentosPorStatus['Aguardando cliente'] || 0) + (documentosPorStatus['Enviado ao cliente'] || 0);
    const documentosAprovados =
        (documentosPorStatus['Aprovado'] || 0) +
        (documentosPorStatus['Apto a faturar'] || 0) +
        (documentosPorStatus['Faturado'] || 0);
    const documentosEmRetrabalho = documentosPorStatus['Reprovado / Necessita ajuste'] || 0;

    const faturas = [...usuarioLogado.faturas].sort(
        (a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime(),
    );
    const valorTotalFaturas = faturas.reduce((sum, fat) => sum + fat.valor, 0);
    const valorPago = faturas.reduce((sum, fat) => sum + fat.valorPago, 0);
    const valorEmAberto = faturas.reduce((sum, fat) => sum + Math.max(fat.valor - fat.valorPago, 0), 0);
    const faturasAtrasadas = faturas.filter((fat) => fat.status === 'Atrasado');
    const valorAtrasado = faturasAtrasadas.reduce((sum, fat) => sum + Math.max(fat.valor - fat.valorPago, 0), 0);

    const proximosPagamentos = faturas
        .filter((fat) => fat.status !== 'Pago' && new Date(fat.vencimento) >= dataReferencia)
        .slice(0, 4);

    const portfolioValorContrato = usuarioLogado.projetos.reduce((sum, proj) => sum + proj.valorContrato, 0);
    const portfolioValorFaturado = usuarioLogado.projetos.reduce((sum, proj) => sum + proj.valorFaturado, 0);
    const portfolioValorRecebido = usuarioLogado.projetos.reduce((sum, proj) => sum + proj.valorRecebido, 0);

    const fisicoPlanejadoMedio = Math.round(
        usuarioLogado.projetos.reduce((sum, proj) => sum + proj.fisicoPlanejado, 0) / usuarioLogado.projetos.length,
    );
    const fisicoRealMedio = Math.round(
        usuarioLogado.projetos.reduce((sum, proj) => sum + proj.fisicoReal, 0) / usuarioLogado.projetos.length,
    );
    const financeiroPlanejadoMedio = Math.round(
        usuarioLogado.projetos.reduce((sum, proj) => sum + proj.financeiroPlanejado, 0) / usuarioLogado.projetos.length,
    );
    const financeiroRealMedio = Math.round(
        usuarioLogado.projetos.reduce((sum, proj) => sum + proj.financeiroReal, 0) / usuarioLogado.projetos.length,
    );

    const projetosComAlerta = usuarioLogado.projetos.filter((proj) => proj.status === 'Atenção' || proj.status === 'Crítico');
    const exibirControleLdPlanilha = usuarioLogado.id === 'transmissora-sul';
    const totalDocumentosKpi = exibirControleLdPlanilha ? portalClienteLdData.documentos.length : totalDocumentos;
    const documentosPendentesClienteKpi = exibirControleLdPlanilha
        ? portalClienteLdData.documentos.filter((doc) => ['PA', 'APROV.', 'EI', 'NN'].includes(doc.statusAtual ?? '')).length
        : documentosPendentesCliente;

    return (
        <div className={styles.page}>
            <div className={styles.dashboard}>
                <header className={styles.portalHeader}>
                    <div className={styles.portalBrand}>
                        <img src={logoEnsiste} alt="Ensiste Grupo im3" className={styles.portalBrandLogo} />
                        <div>
                            <span className={styles.portalEyebrow}>Portal do Cliente (Demo)</span>
                            <h1 className={styles.portalTitle}>{usuarioLogado.empresa}</h1>
                            <p className={styles.portalSubtitle}>
                                {usuarioLogado.contato} • {usuarioLogado.perfil} • CNPJ {usuarioLogado.cnpjMascara}
                            </p>
                        </div>
                    </div>

                    <div className={styles.portalActions}>
                        <div className={styles.referenceChip}>
                            <CalendarClock size={16} />
                            Atualizado em {new Intl.DateTimeFormat('pt-BR').format(new Date())}
                        </div>
                        <button type="button" className={styles.ghostButton} onClick={handleLogout}>
                            <LogOut size={16} />
                            Trocar cliente
                        </button>
                    </div>
                </header>

                <section className={styles.kpiGrid}>
                    <KpiCard
                        title="Contratos / Projetos"
                        value={`${usuarioLogado.contratosAtivos} contratos • ${usuarioLogado.projetos.length} projetos`}
                        subtitle={`${projetosComAlerta.length} projeto(s) em atenção/crítico`}
                        icon={<Building2 size={18} />}
                        highlight={projetosComAlerta.length ? 'warning' : 'success'}
                    />
                    <KpiCard
                        title="Documentos"
                        value={totalDocumentosKpi}
                        subtitle={`${documentosPendentesClienteKpi} pendente(s) de ação do cliente`}
                        icon={<FileText size={18} />}
                        highlight={documentosPendentesClienteKpi ? 'warning' : 'info'}
                    />
                    <KpiCard
                        title="Faturado / Pago"
                        value={formatMoney(portfolioValorRecebido)}
                        subtitle={`${formatMoney(portfolioValorFaturado)} faturado (${formatMoney(portfolioValorContrato)} contrato)`}
                        icon={<CreditCard size={18} />}
                        highlight="success"
                    />
                    <KpiCard
                        title="Em Aberto / Atrasado"
                        value={formatMoney(valorEmAberto)}
                        subtitle={`${formatMoney(valorAtrasado)} em atraso`}
                        icon={<Wallet size={18} />}
                        highlight={valorAtrasado > 0 ? 'danger' : 'info'}
                    />
                </section>

                <section className={styles.sectionGrid}>
                    <section className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelEyebrow}>Status dos projetos</span>
                                <h2 className={styles.panelTitle}>Cumprimento físico e financeiro</h2>
                            </div>
                            <div className={styles.compactMetrics}>
                                <span>Físico: {fisicoRealMedio}% / {fisicoPlanejadoMedio}%</span>
                                <span>Financeiro: {financeiroRealMedio}% / {financeiroPlanejadoMedio}%</span>
                            </div>
                        </div>

                        <div className={styles.projectList}>
                            {usuarioLogado.projetos.map((projeto) => {
                                const fisicoCumprimento = percentualCumprimento(projeto.fisicoReal, projeto.fisicoPlanejado);
                                const financeiroCumprimento = percentualCumprimento(
                                    projeto.financeiroReal,
                                    projeto.financeiroPlanejado,
                                );

                                return (
                                    <article key={projeto.id} className={styles.projectCard}>
                                        <div className={styles.projectHeader}>
                                            <div>
                                                <h3>{projeto.nome}</h3>
                                                <p>
                                                    Atualizado em {formatDate(projeto.atualizadoEm)} • Próximo marco:{' '}
                                                    {projeto.proximoMarco}
                                                </p>
                                            </div>
                                            <span className={`${styles.statusPill} ${getProjetoStatusClass(projeto.status)}`}>
                                                {projeto.status}
                                            </span>
                                        </div>

                                        <div className={styles.projectFinancials}>
                                            <div>
                                                <span>Contrato</span>
                                                <strong>{formatMoney(projeto.valorContrato)}</strong>
                                            </div>
                                            <div>
                                                <span>Faturado</span>
                                                <strong>{formatMoney(projeto.valorFaturado)}</strong>
                                            </div>
                                            <div>
                                                <span>Recebido</span>
                                                <strong>{formatMoney(projeto.valorRecebido)}</strong>
                                            </div>
                                        </div>

                                        <div className={styles.progressRows}>
                                            <div className={styles.progressBlock}>
                                                <div className={styles.progressLabel}>
                                                    <span>Físico</span>
                                                    <strong>
                                                        {percentFormatter.format(projeto.fisicoReal)}% real /{' '}
                                                        {percentFormatter.format(projeto.fisicoPlanejado)}% planejado
                                                    </strong>
                                                </div>
                                                <div className={styles.progressTrack}>
                                                    <div
                                                        className={styles.progressPlan}
                                                        style={{ width: `${Math.min(projeto.fisicoPlanejado, 100)}%` }}
                                                    />
                                                    <div
                                                        className={styles.progressReal}
                                                        style={{ width: `${Math.min(projeto.fisicoReal, 100)}%` }}
                                                    />
                                                </div>
                                                <span
                                                    className={
                                                        fisicoCumprimento >= 100
                                                            ? styles.deltaPositive
                                                            : fisicoCumprimento >= 90
                                                                ? styles.deltaWarning
                                                                : styles.deltaNegative
                                                    }
                                                >
                                                    Cumprimento: {fisicoCumprimento}%
                                                </span>
                                            </div>

                                            <div className={styles.progressBlock}>
                                                <div className={styles.progressLabel}>
                                                    <span>Financeiro</span>
                                                    <strong>
                                                        {percentFormatter.format(projeto.financeiroReal)}% real /{' '}
                                                        {percentFormatter.format(projeto.financeiroPlanejado)}% planejado
                                                    </strong>
                                                </div>
                                                <div className={styles.progressTrack}>
                                                    <div
                                                        className={styles.progressPlan}
                                                        style={{ width: `${Math.min(projeto.financeiroPlanejado, 100)}%` }}
                                                    />
                                                    <div
                                                        className={`${styles.progressReal} ${styles.progressFinancial}`}
                                                        style={{ width: `${Math.min(projeto.financeiroReal, 100)}%` }}
                                                    />
                                                </div>
                                                <span
                                                    className={
                                                        financeiroCumprimento >= 100
                                                            ? styles.deltaPositive
                                                            : financeiroCumprimento >= 90
                                                                ? styles.deltaWarning
                                                                : styles.deltaNegative
                                                    }
                                                >
                                                    Cumprimento: {financeiroCumprimento}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.projectFooter}>
                                            <span>Último marco: {projeto.ultimoMarco}</span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelEyebrow}>Faturamento</span>
                                <h2 className={styles.panelTitle}>Pagamentos e faturas</h2>
                            </div>
                            <div className={styles.compactMetrics}>
                                <span>Total emitido: {formatMoney(valorTotalFaturas)}</span>
                                <span>Pago: {formatMoney(valorPago)}</span>
                            </div>
                        </div>

                        <div className={styles.financeKpis}>
                            <div className={styles.miniKpi}>
                                <span>Pago</span>
                                <strong>{formatMoney(valorPago)}</strong>
                                <small>Liquidações confirmadas</small>
                            </div>
                            <div className={styles.miniKpi}>
                                <span>Deve pagar</span>
                                <strong>{formatMoney(valorEmAberto)}</strong>
                                <small>Saldo em aberto / parcial</small>
                            </div>
                            <div className={styles.miniKpi}>
                                <span>Atrasado</span>
                                <strong>{formatMoney(valorAtrasado)}</strong>
                                <small>{faturasAtrasadas.length} fatura(s)</small>
                            </div>
                        </div>

                        <div className={styles.subPanel}>
                            <div className={styles.subPanelHeader}>
                                <h3>Próximos pagamentos</h3>
                                <span>{proximosPagamentos.length} item(ns)</span>
                            </div>
                            <div className={styles.paymentAgenda}>
                                {proximosPagamentos.length === 0 && (
                                    <div className={styles.emptyStateInline}>
                                        <CheckCircle2 size={16} />
                                        Nenhum pagamento futuro pendente no recorte atual.
                                    </div>
                                )}

                                {proximosPagamentos.map((fatura) => (
                                    <div key={fatura.id} className={styles.paymentItem}>
                                        <div>
                                            <strong>{fatura.descricao}</strong>
                                            <span className={styles.paymentMeta}>
                                                {fatura.projeto} • vence em {formatDate(fatura.vencimento)}
                                            </span>
                                        </div>
                                        <div className={styles.paymentValues}>
                                            <strong>{formatMoney(Math.max(fatura.valor - fatura.valorPago, 0))}</strong>
                                            <span className={`${styles.statusPill} ${getFaturaStatusClass(fatura.status)}`}>
                                                {fatura.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Projeto / Fatura</th>
                                        <th>Competência</th>
                                        <th>Vencimento</th>
                                        <th>Valor</th>
                                        <th>Pago</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faturas.map((fatura) => (
                                        <tr key={fatura.id}>
                                            <td>
                                                <strong>{fatura.projeto}</strong>
                                                <span className={styles.cellSubtext}>{fatura.descricao}</span>
                                            </td>
                                            <td>{fatura.competencia}</td>
                                            <td>{formatDate(fatura.vencimento)}</td>
                                            <td>{formatMoney(fatura.valor)}</td>
                                            <td>{formatMoney(fatura.valorPago)}</td>
                                            <td>
                                                <span className={`${styles.statusPill} ${getFaturaStatusClass(fatura.status)}`}>
                                                    {fatura.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </section>

                <section className={styles.sectionGrid}>
                    {exibirControleLdPlanilha ? (
                        <section className={styles.panel}>
                            <PortalClienteLdSection projetoPortalLabel={usuarioLogado.projetos[0]?.nome} />
                        </section>
                    ) : (
                        <section className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelEyebrow}>Status dos documentos</span>
                                <h2 className={styles.panelTitle}>Documentos por projeto e pacote</h2>
                            </div>
                            <div className={styles.searchField}>
                                <input
                                    type="text"
                                    value={buscaDocumento}
                                    onChange={(e) => setBuscaDocumento(e.target.value)}
                                    placeholder="Buscar documento, pacote ou disciplina..."
                                />
                            </div>
                        </div>

                        <div className={styles.documentSummary}>
                            <div className={styles.documentSummaryItem}>
                                <span>Pendentes cliente</span>
                                <strong>{documentosPendentesCliente}</strong>
                            </div>
                            <div className={styles.documentSummaryItem}>
                                <span>Aprovados / faturáveis</span>
                                <strong>{documentosAprovados}</strong>
                            </div>
                            <div className={styles.documentSummaryItem}>
                                <span>Retrabalho</span>
                                <strong>{documentosEmRetrabalho}</strong>
                            </div>
                            <div className={styles.documentSummaryItem}>
                                <span>Total</span>
                                <strong>{totalDocumentos}</strong>
                            </div>
                        </div>

                        <div className={styles.statusChips}>
                            {Object.entries(documentosPorStatus)
                                .sort((a, b) => b[1] - a[1])
                                .map(([status, count]) => (
                                    <div key={status} className={styles.statusChip}>
                                        <Badge type="status" value={status} />
                                        <span>{count}</span>
                                    </div>
                                ))}
                        </div>

                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Documento</th>
                                        <th>Projeto</th>
                                        <th>Disciplina</th>
                                        <th>Status</th>
                                        <th>Valor estimado</th>
                                        <th>Última movimentação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documentosFiltrados.map((doc) => {
                                        const ultimoEvento = doc.historico[doc.historico.length - 1];
                                        return (
                                            <tr key={doc.id}>
                                                <td>
                                                    <strong>{doc.documento}</strong>
                                                    <span className={styles.cellSubtext}>{doc.pacote}</span>
                                                </td>
                                                <td>{doc.projeto}</td>
                                                <td>{doc.disciplina}</td>
                                                <td>
                                                    <Badge type="status" value={doc.status} />
                                                </td>
                                                <td>{formatMoney(doc.valorEstimado)}</td>
                                                <td>
                                                    {ultimoEvento ? (
                                                        <>
                                                            <strong>{formatIsoDateTime(ultimoEvento.dataHora)}</strong>
                                                            <span className={styles.cellSubtext}>{ultimoEvento.descricao}</span>
                                                        </>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {documentosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className={styles.emptyStateInline}>
                                                    <FileText size={16} />
                                                    Nenhum documento encontrado para a busca informada.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    )}

                    <section className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelEyebrow}>Acompanhamento executivo</span>
                                <h2 className={styles.panelTitle}>Alertas e indicadores de cumprimento</h2>
                            </div>
                        </div>

                        <div className={styles.alertList}>
                            {projetosComAlerta.map((projeto) => (
                                <div key={`${projeto.id}-alerta`} className={styles.alertCard}>
                                    <div className={styles.alertIcon}>
                                        {projeto.status === 'Crítico' ? <AlertTriangle size={16} /> : <CalendarClock size={16} />}
                                    </div>
                                    <div className={styles.alertBody}>
                                        <strong>{projeto.nome}</strong>
                                        <p>
                                            {projeto.status === 'Crítico'
                                                ? 'Projeto com desvio relevante no cumprimento físico/financeiro e impacto em faturamento.'
                                                : 'Projeto requer atenção para recuperar cronograma e evitar atraso de marcos.'}
                                        </p>
                                        <span>
                                            Próximo marco: {projeto.proximoMarco} • Atualização {formatDate(projeto.atualizadoEm)}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {faturasAtrasadas.map((fatura) => (
                                <div key={`${fatura.id}-finance`} className={styles.alertCard}>
                                    <div className={`${styles.alertIcon} ${styles.alertIconDanger}`}>
                                        <Wallet size={16} />
                                    </div>
                                    <div className={styles.alertBody}>
                                        <strong>{fatura.projeto} • faturamento em atraso</strong>
                                        <p>{fatura.descricao}</p>
                                        <span>
                                            Vencimento: {formatDate(fatura.vencimento)} • Saldo:{' '}
                                            {formatMoney(Math.max(fatura.valor - fatura.valorPago, 0))}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {projetosComAlerta.length === 0 && faturasAtrasadas.length === 0 && (
                                <div className={styles.emptyStateBlock}>
                                    <CheckCircle2 size={18} />
                                    <div>
                                        <strong>Sem alertas críticos no recorte atual</strong>
                                        <p>Todos os projetos e pagamentos estão dentro do intervalo monitorado na demo.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.compliancePanel}>
                            <h3>Cumprimento consolidado da carteira</h3>
                            <div className={styles.complianceRows}>
                                <div className={styles.complianceRow}>
                                    <span>Físico (real vs planejado)</span>
                                    <strong>
                                        {fisicoRealMedio}% / {fisicoPlanejadoMedio}%
                                    </strong>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressPlan} style={{ width: `${fisicoPlanejadoMedio}%` }} />
                                    <div className={styles.progressReal} style={{ width: `${fisicoRealMedio}%` }} />
                                </div>

                                <div className={styles.complianceRow}>
                                    <span>Financeiro (real vs planejado)</span>
                                    <strong>
                                        {financeiroRealMedio}% / {financeiroPlanejadoMedio}%
                                    </strong>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressPlan} style={{ width: `${financeiroPlanejadoMedio}%` }} />
                                    <div
                                        className={`${styles.progressReal} ${styles.progressFinancial}`}
                                        style={{ width: `${financeiroRealMedio}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    );
};
