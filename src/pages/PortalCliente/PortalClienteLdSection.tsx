import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    CalendarClock,
    CircleAlert,
    FileSpreadsheet,
    GitBranch,
    ListFilter,
    Timer,
} from 'lucide-react';
import {
    LdAcompanhamentoDisciplina,
    LdDocumento,
    LdRevisionCycle,
    portalClienteLdData,
} from '../../data/portalClienteLdData';
import styles from './PortalClienteLdSection.module.css';

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type QuickFilter = 'todos' | 'pendencias' | 'atrasados';
type DisciplinaFiltro = 'TODAS' | 'CIV' | 'EMEC' | 'SPCS';
type CurvaDisciplina = 'GERAL' | 'CIV' | 'EMEC' | 'SPCS';

interface PortalClienteLdSectionProps {
    projetoLabel?: string;
    contexto?: 'interno' | 'portal';
}

interface DocumentoInsight {
    doc: LdDocumento;
    ultimoCiclo: LdRevisionCycle | null;
    cicloAberto: LdRevisionCycle | null;
    ultimaMovData: string | null;
    proximaPrevisao: string | null;
    diasSemRetorno: number | null;
    atrasado: boolean;
    atrasoMotivo: 'retorno' | 'emissao' | null;
}

const DEMO_REFERENCE_DATE = new Date('2026-02-23T00:00:00');

const dateFormatter = new Intl.DateTimeFormat('pt-BR');
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' });

const PENDING_CLIENT_STATUSES = new Set(['PA', 'APROV.', 'EI', 'NN']);
const APPROVED_STATUSES = new Set(['CO', 'LE', 'CC']);
const ANALYSIS_STATUSES = new Set(['PA', 'APROV.', 'EI', 'NN', 'LC']);

const DISCIPLINA_LABELS: Record<Exclude<DisciplinaFiltro, 'TODAS'>, string> = {
    CIV: 'Civil',
    EMEC: 'Eletromecânico',
    SPCS: 'Elétrico / SPCS',
};

const CURVA_DISCIPLINA_OPTIONS: Array<{ value: CurvaDisciplina; label: string }> = [
    { value: 'GERAL', label: 'Geral' },
    { value: 'CIV', label: 'Civil' },
    { value: 'EMEC', label: 'EMEC' },
    { value: 'SPCS', label: 'SPCS' },
];

const safeParseDate = (value: string | null | undefined) => {
    if (!value) return null;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value: string | null | undefined) => {
    const parsed = safeParseDate(value);
    return parsed ? dateFormatter.format(parsed) : '—';
};

const formatMonth = (value: string | null | undefined) => {
    const parsed = safeParseDate(value);
    return parsed ? monthFormatter.format(parsed).replace('.', '') : '';
};

const daysBetween = (start: Date, end: Date) => {
    const ms = end.getTime() - start.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
};

const getStatusTone = (status: string | null | undefined): StatusTone => {
    switch (status) {
        case 'CO':
        case 'LE':
        case 'CC':
            return 'success';
        case 'PA':
        case 'APROV.':
        case 'LC':
        case 'EI':
        case 'NN':
            return 'warning';
        case 'DC':
        case 'CA':
            return 'danger';
        case 'IF':
            return 'info';
        case 'NE':
        case 'LP':
        default:
            return 'neutral';
    }
};

const statusToneClass = (status: string | null | undefined) => {
    const tone = getStatusTone(status);
    switch (tone) {
        case 'success':
            return styles.statusSuccess;
        case 'warning':
            return styles.statusWarning;
        case 'danger':
            return styles.statusDanger;
        case 'info':
            return styles.statusInfo;
        case 'neutral':
        default:
            return styles.statusNeutral;
    }
};

const buildDocumentoInsight = (doc: LdDocumento): DocumentoInsight => {
    const ultimoCiclo = doc.ciclos.length ? doc.ciclos[doc.ciclos.length - 1] : null;
    const cicloAberto =
        [...doc.ciclos]
            .reverse()
            .find((ciclo) => Boolean(ciclo.envioData) && !ciclo.retornoData) ?? null;

    const eventDates: string[] = [];
    for (const ciclo of doc.ciclos) {
        if (ciclo.envioData) eventDates.push(ciclo.envioData);
        if (ciclo.retornoData) eventDates.push(ciclo.retornoData);
    }
    const ultimaMovData = eventDates.sort().at(-1) ?? null;

    const previsoesOrdenadas = [...doc.previsoesEnvio].sort();
    const proximaPrevisao =
        previsoesOrdenadas.find((data) => {
            const parsed = safeParseDate(data);
            return parsed && parsed >= DEMO_REFERENCE_DATE;
        }) ?? null;

    let diasSemRetorno: number | null = null;
    if (cicloAberto?.envioData) {
        const envioDate = safeParseDate(cicloAberto.envioData);
        if (envioDate) {
            diasSemRetorno = daysBetween(envioDate, DEMO_REFERENCE_DATE);
        }
    }

    let atrasado = false;
    let atrasoMotivo: DocumentoInsight['atrasoMotivo'] = null;

    if (diasSemRetorno !== null && diasSemRetorno > 10) {
        atrasado = true;
        atrasoMotivo = 'retorno';
    } else if (!doc.ciclos.length) {
        const ultimaPrevisao = previsoesOrdenadas.at(-1) ?? null;
        const previsaoDate = safeParseDate(ultimaPrevisao);
        if (previsaoDate && previsaoDate < DEMO_REFERENCE_DATE && doc.statusAtual === 'NE') {
            atrasado = true;
            atrasoMotivo = 'emissao';
        }
    }

    return {
        doc,
        ultimoCiclo,
        cicloAberto,
        ultimaMovData,
        proximaPrevisao,
        diasSemRetorno,
        atrasado,
        atrasoMotivo,
    };
};

const countBy = <T extends string>(values: Array<T | null | undefined>) => {
    const counters: Record<string, number> = {};
    for (const value of values) {
        if (!value) continue;
        counters[value] = (counters[value] ?? 0) + 1;
    }
    return counters;
};

const getProgressPath = (values: Array<number | null>, width = 420, height = 170) => {
    const padLeft = 28;
    const padRight = 14;
    const padTop = 12;
    const padBottom = 26;
    const innerWidth = Math.max(width - padLeft - padRight, 1);
    const innerHeight = Math.max(height - padTop - padBottom, 1);
    const total = Math.max(values.length - 1, 1);
    const points = values
        .map((value, index) => {
            if (value == null) return null;
            const x = padLeft + (index / total) * innerWidth;
            const normalized = Math.min(Math.max(value, 0), 100);
            const y = padTop + ((100 - normalized) / 100) * innerHeight;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .filter(Boolean);
    return points.length ? `M ${points.join(' L ')}` : '';
};

const LdStatusPill = ({ code, label }: { code: string | null | undefined; label?: string | null }) => {
    if (!code && !label) return <span className={`${styles.statusPill} ${styles.statusNeutral}`}>Sem status</span>;
    return (
        <span className={`${styles.statusPill} ${statusToneClass(code)}`}>
            <strong>{code}</strong>
            {label && <small>{label}</small>}
        </span>
    );
};

const MetricTile = ({
    label,
    value,
    help,
    tone = 'neutral',
}: {
    label: string;
    value: React.ReactNode;
    help?: string;
    tone?: StatusTone;
}) => (
    <div className={`${styles.metricTile} ${styles[`metric${tone[0].toUpperCase()}${tone.slice(1)}` as keyof typeof styles]}`}>
        <span>{label}</span>
        <strong>{value}</strong>
        {help && <small>{help}</small>}
    </div>
);

const DistributionList = ({
    title,
    subtitle,
    items,
}: {
    title: string;
    subtitle?: string;
    items: Array<{ label: string; value: number; tone?: StatusTone }>;
}) => {
    const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
    return (
        <section className={styles.subCard}>
            <div className={styles.subCardHeader}>
                <h3>{title}</h3>
                {subtitle && <span>{subtitle}</span>}
            </div>
            <div className={styles.distributionList}>
                {items.map((item) => {
                    const pct = (item.value / total) * 100;
                    return (
                        <div key={item.label} className={styles.distributionRow}>
                            <div className={styles.distributionLabelRow}>
                                <span>{item.label}</span>
                                <strong>{item.value}</strong>
                            </div>
                            <div className={styles.distributionTrack}>
                                <div
                                    className={`${styles.distributionFill} ${
                                        item.tone ? styles[`fill${item.tone[0].toUpperCase()}${item.tone.slice(1)}` as keyof typeof styles] : ''
                                    }`}
                                    style={{ width: `${pct.toFixed(1)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const CurveCard = ({
    title,
    months,
    planned,
    actual,
}: {
    title: string;
    months: string[];
    planned: Array<number | null>;
    actual: Array<number | null>;
}) => {
    const width = 420;
    const height = 170;
    const gridLines = [0, 25, 50, 75, 100];
    const lastPlanned = [...planned].reverse().find((item) => item != null) ?? null;
    const lastActual = [...actual].reverse().find((item) => item != null) ?? null;

    return (
        <section className={styles.subCard}>
            <div className={styles.subCardHeader}>
                <h3>{title}</h3>
                <div className={styles.inlineLegend}>
                    <span className={styles.legendItem}>
                        <i className={styles.legendPlanned} />
                        Planejado
                    </span>
                    <span className={styles.legendItem}>
                        <i className={styles.legendActual} />
                        Realizado
                    </span>
                </div>
            </div>

            <div className={styles.curveChartWrap}>
                <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} planejado versus realizado`}>
                    {gridLines.map((line) => {
                        const y = 12 + ((100 - line) / 100) * (height - 38);
                        return (
                            <g key={line}>
                                <line x1="28" x2={width - 14} y1={y} y2={y} className={styles.gridLine} />
                                <text x="0" y={y + 4} className={styles.axisLabel}>
                                    {line}%
                                </text>
                            </g>
                        );
                    })}
                    <path d={getProgressPath(planned, width, height)} className={styles.pathPlanned} />
                    <path d={getProgressPath(actual, width, height)} className={styles.pathActual} />
                    {months.map((month, index) => {
                        if (index % 4 !== 0 && index !== months.length - 1) return null;
                        const x = 28 + (index / Math.max(months.length - 1, 1)) * (width - 42);
                        return (
                            <text key={`${month}-${index}`} x={x} y={height - 4} className={styles.axisLabelCentered}>
                                {formatMonth(month)}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className={styles.curveFoot}>
                <span>Planejado atual: {lastPlanned != null ? `${lastPlanned.toFixed(1)}%` : '—'}</span>
                <span>Realizado atual: {lastActual != null ? `${lastActual.toFixed(1)}%` : '—'}</span>
            </div>
        </section>
    );
};

export const PortalClienteLdSection: React.FC<PortalClienteLdSectionProps> = ({
    projetoLabel,
    contexto = 'interno',
}) => {
    const isInterno = contexto === 'interno';
    const [busca, setBusca] = useState('');
    const [filtroDisciplina, setFiltroDisciplina] = useState<DisciplinaFiltro>('TODAS');
    const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('todos');
    const [curvaDisciplina, setCurvaDisciplina] = useState<CurvaDisciplina>('GERAL');
    const [selectedDocumentoId, setSelectedDocumentoId] = useState<string | null>(null);

    const docs = portalClienteLdData.documentos;
    const insights = docs.map(buildDocumentoInsight);

    const totalDocs = insights.length;
    const docsPendentesCliente = insights.filter((item) => PENDING_CLIENT_STATUSES.has(item.doc.statusAtual ?? '')).length;
    const docsEmAnalise = insights.filter((item) => ANALYSIS_STATUSES.has(item.doc.statusAtual ?? '')).length;
    const docsAprovados = insights.filter((item) => APPROVED_STATUSES.has(item.doc.statusAtual ?? '')).length;
    const docsAtrasados = insights.filter((item) => item.atrasado).length;
    const proximosEnvios15Dias = insights.filter((item) => {
        if (!item.proximaPrevisao) return false;
        const dt = safeParseDate(item.proximaPrevisao);
        if (!dt) return false;
        const delta = daysBetween(DEMO_REFERENCE_DATE, dt);
        return delta >= 0 && delta <= 15;
    }).length;

    const buscaNormalizada = busca.trim().toLowerCase();
    const insightsFiltrados = insights.filter((item) => {
        if (filtroDisciplina !== 'TODAS' && item.doc.disciplina !== filtroDisciplina) return false;
        if (filtroStatus !== 'TODOS' && item.doc.statusAtual !== filtroStatus) return false;
        if (quickFilter === 'pendencias' && !PENDING_CLIENT_STATUSES.has(item.doc.statusAtual ?? '')) return false;
        if (quickFilter === 'atrasados' && !item.atrasado) return false;
        if (!buscaNormalizada) return true;

        const fields = [
            item.doc.codigo,
            item.doc.codigoOriginal,
            item.doc.codigoKC,
            item.doc.descricao,
            item.doc.classe,
            item.doc.disciplina,
            item.doc.observacao,
            item.doc.ultimaGrd,
        ]
            .filter(Boolean)
            .map((field) => String(field).toLowerCase());

        return fields.some((field) => field.includes(buscaNormalizada));
    });

    const statusCounts = countBy(insights.map((item) => item.doc.statusAtual));
    const disciplinaCounts = countBy(insights.map((item) => item.doc.disciplina));

    const statusOptions = Object.entries(statusCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([code]) => code);

    const disciplinaCurveMap = portalClienteLdData.acompanhamento.disciplinas.reduce<Record<string, LdAcompanhamentoDisciplina>>(
        (acc, item) => {
            acc[item.sigla] = item;
            return acc;
        },
        {},
    );

    const weightedTotals = {
        CIV: disciplinaCounts.CIV ?? 0,
        EMEC: disciplinaCounts.EMEC ?? 0,
        SPCS: disciplinaCounts.SPCS ?? 0,
    };

    const defaultCurveMonths =
        disciplinaCurveMap.EMEC?.meses ?? disciplinaCurveMap.CIV?.meses ?? disciplinaCurveMap.SPCS?.meses ?? [];
    const aggregateSeries = (selector: (item: LdAcompanhamentoDisciplina) => Array<number | null>) =>
        defaultCurveMonths.map((_, index) => {
            let sum = 0;
            let weightSum = 0;
            for (const sigla of ['CIV', 'EMEC', 'SPCS'] as const) {
                const bloco = disciplinaCurveMap[sigla];
                if (!bloco) continue;
                const value = selector(bloco)[index];
                const weight = weightedTotals[sigla];
                if (value == null || weight <= 0) continue;
                sum += value * weight;
                weightSum += weight;
            }
            return weightSum > 0 ? Number((sum / weightSum).toFixed(1)) : null;
        });

    const aggregateMetrics = () => {
        let revisao = 0;
        let analise = 0;
        let weightSum = 0;
        for (const sigla of ['CIV', 'EMEC', 'SPCS'] as const) {
            const bloco = disciplinaCurveMap[sigla];
            const weight = weightedTotals[sigla];
            if (!bloco || weight <= 0) continue;
            revisao += bloco.mediaRevisaoDias * weight;
            analise += bloco.mediaAnaliseDias * weight;
            weightSum += weight;
        }
        return {
            mediaRevisaoDias: weightSum > 0 ? Number((revisao / weightSum).toFixed(2)) : 0,
            mediaAnaliseDias: weightSum > 0 ? Number((analise / weightSum).toFixed(2)) : 0,
        };
    };

    const curvaSelecionada =
        curvaDisciplina === 'GERAL'
            ? {
                  sigla: 'GERAL',
                  nome: 'Carteira consolidada',
                  meses: defaultCurveMonths,
                  emissao: {
                      planejado: aggregateSeries((item) => item.emissao.planejado),
                      realizado: aggregateSeries((item) => item.emissao.realizado),
                  },
                  aprovacao: {
                      planejado: aggregateSeries((item) => item.aprovacao.planejado),
                      realizado: aggregateSeries((item) => item.aprovacao.realizado),
                  },
                  ...aggregateMetrics(),
              }
            : disciplinaCurveMap[curvaDisciplina];

    useEffect(() => {
        if (!insightsFiltrados.length) {
            setSelectedDocumentoId(null);
            return;
        }
        const stillExists = insightsFiltrados.some((item) => item.doc.id === selectedDocumentoId);
        if (stillExists) return;
        const prioritized =
            insightsFiltrados.find((item) => item.atrasado) ??
            insightsFiltrados.find((item) => PENDING_CLIENT_STATUSES.has(item.doc.statusAtual ?? '')) ??
            insightsFiltrados[0];
        setSelectedDocumentoId(prioritized.doc.id);
    }, [insightsFiltrados, selectedDocumentoId]);

    const insightSelecionado =
        insightsFiltrados.find((item) => item.doc.id === selectedDocumentoId) ??
        insights.find((item) => item.doc.id === selectedDocumentoId) ??
        null;

    const distributionStatusItems = Object.entries(statusCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([status, value]) => ({
            label: `${status} · ${portalClienteLdData.statusLegend[status] ?? status}`,
            value,
            tone: getStatusTone(status),
        }));

    const distributionDisciplinaItems = (['EMEC', 'CIV', 'SPCS'] as const).map((sigla) => ({
        label: `${sigla} · ${DISCIPLINA_LABELS[sigla]}`,
        value: disciplinaCounts[sigla] ?? 0,
        tone: 'info' as StatusTone,
    }));

    return (
        <div className={styles.section}>
            <header className={styles.header}>
                <div>
                    <div className={styles.eyebrow}>
                        <FileSpreadsheet size={14} />
                        {isInterno ? 'Gestão interna de documentos ENSISTE (LD)' : 'Controle documental importado do Excel (LD)'}
                    </div>
                    <h2 className={styles.title}>
                        {isInterno ? 'Controle Documental (LD) da Engenharia' : 'Lista de Documentos (LD) dentro do Portal do Cliente'}
                    </h2>
                    <p className={styles.subtitle}>
                        {isInterno ? 'Visualização interna do fornecedor ENSISTE para acompanhamento de emissão, retorno e aprovação de documentos do projeto ' : 'Visualização demo do controle da planilha para o projeto '}
                        <strong>{projetoLabel ?? 'Subestação 230kV'}</strong> {isInterno ? 'com dados reais importados do Excel.' : 'com dados reais importados da aba '}
                        {!isInterno && (
                            <>
                                <code>{portalClienteLdData.meta.abaPrincipal}</code>.
                            </>
                        )}
                        {isInterno && (
                            <>
                                {' '}Aba de origem: <code>{portalClienteLdData.meta.abaPrincipal}</code>.
                            </>
                        )}
                    </p>
                </div>
                <div className={styles.headerMeta}>
                    <div className={styles.metaChip}>
                        <CalendarClock size={14} />
                        Referência da demo: 23/02/2026
                    </div>
                    <div className={styles.metaChip}>
                        <BarChart3 size={14} />
                        {portalClienteLdData.meta.totalDocumentosImportados} documentos importados
                    </div>
                </div>
            </header>

            <div className={styles.metricsGrid}>
                <MetricTile label="Total LD" value={totalDocs} help="Linhas documentais importadas" />
                <MetricTile label="Pendentes cliente" value={docsPendentesCliente} tone="warning" help="PA / APROV. / EI / NN" />
                <MetricTile label="Em análise / revisão" value={docsEmAnalise} tone="warning" help="Fluxo ativo de aprovação" />
                <MetricTile label="Aprovados / liberação" value={docsAprovados} tone="success" help="CO / LE / CC" />
                <MetricTile label="Atrasados" value={docsAtrasados} tone={docsAtrasados ? 'danger' : 'neutral'} help="Sem envio ou sem retorno no prazo" />
                <MetricTile label="Próximos envios (15d)" value={proximosEnvios15Dias} tone="info" help="Com previsão futura próxima" />
            </div>

            <div className={styles.analyticsGrid}>
                <div className={styles.analyticsColumn}>
                    <DistributionList
                        title="Distribuição por status atual"
                        subtitle="Status calculado pela planilha"
                        items={distributionStatusItems}
                    />
                    <DistributionList
                        title="Distribuição por disciplina"
                        subtitle="CIV / EMEC / SPCS"
                        items={distributionDisciplinaItems}
                    />
                </div>

                <div className={styles.analyticsColumn}>
                    <section className={styles.subCard}>
                        <div className={styles.subCardHeader}>
                            <h3>Curvas de acompanhamento (aba Acompanhamento)</h3>
                            <div className={styles.disciplinaTabs} role="tablist" aria-label="Selecionar disciplina das curvas">
                                {CURVA_DISCIPLINA_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="tab"
                                        aria-selected={curvaDisciplina === option.value}
                                        className={curvaDisciplina === option.value ? styles.tabActive : styles.tabButton}
                                        onClick={() => setCurvaDisciplina(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.curveMetaStrip}>
                            <div>
                                <span>Disciplina</span>
                                <strong>{curvaSelecionada?.nome ?? '—'}</strong>
                            </div>
                            <div>
                                <span>Média revisão</span>
                                <strong>{curvaSelecionada ? `${curvaSelecionada.mediaRevisaoDias} dias` : '—'}</strong>
                            </div>
                            <div>
                                <span>Média análise</span>
                                <strong>{curvaSelecionada ? `${curvaSelecionada.mediaAnaliseDias} dias` : '—'}</strong>
                            </div>
                        </div>
                    </section>

                    {curvaSelecionada && (
                        <>
                            <CurveCard
                                title="Emissão (Planejado x Realizado)"
                                months={curvaSelecionada.meses}
                                planned={curvaSelecionada.emissao.planejado}
                                actual={curvaSelecionada.emissao.realizado}
                            />
                            <CurveCard
                                title="Aprovação (Planejado x Realizado)"
                                months={curvaSelecionada.meses}
                                planned={curvaSelecionada.aprovacao.planejado}
                                actual={curvaSelecionada.aprovacao.realizado}
                            />
                        </>
                    )}
                </div>
            </div>

            <section className={styles.subCard}>
                <div className={styles.subCardHeader}>
                    <h3>Lista de documentos (filtros + status atual + histórico por documento)</h3>
                    <span>{insightsFiltrados.length} item(ns) no filtro</span>
                </div>

                <div className={styles.filterBar}>
                    <label className={styles.searchField}>
                        <span>Buscar</span>
                        <input
                            type="text"
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                            placeholder="Código, descrição, GRD, observação..."
                        />
                    </label>

                    <label className={styles.selectField}>
                        <span>Disciplina</span>
                        <select
                            value={filtroDisciplina}
                            onChange={(event) => setFiltroDisciplina(event.target.value as DisciplinaFiltro)}
                        >
                            <option value="TODAS">Todas</option>
                            <option value="CIV">Civil</option>
                            <option value="EMEC">Eletromecânico</option>
                            <option value="SPCS">Elétrico / SPCS</option>
                        </select>
                    </label>

                    <label className={styles.selectField}>
                        <span>Status atual</span>
                        <select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)}>
                            <option value="TODOS">Todos</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status} · {portalClienteLdData.statusLegend[status] ?? status}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className={styles.quickFilters}>
                        <span className={styles.quickFiltersLabel}>
                            <ListFilter size={14} />
                            Recortes rápidos
                        </span>
                        <div className={styles.quickButtons}>
                            <button
                                type="button"
                                className={quickFilter === 'todos' ? styles.quickButtonActive : styles.quickButton}
                                onClick={() => setQuickFilter('todos')}
                            >
                                Todos
                            </button>
                            <button
                                type="button"
                                className={quickFilter === 'pendencias' ? styles.quickButtonActive : styles.quickButton}
                                onClick={() => setQuickFilter('pendencias')}
                            >
                                Pendentes cliente
                            </button>
                            <button
                                type="button"
                                className={quickFilter === 'atrasados' ? styles.quickButtonActive : styles.quickButton}
                                onClick={() => setQuickFilter('atrasados')}
                            >
                                Atrasados
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.tableAndDetail}>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Disc./Classe</th>
                                    <th>Rev / Status</th>
                                    <th>Último ciclo</th>
                                    <th>Previsão / Atraso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insightsFiltrados.map((item) => {
                                    const doc = item.doc;
                                    const isSelected = selectedDocumentoId === doc.id;
                                    const atrasoTexto =
                                        item.atrasado && item.atrasoMotivo === 'retorno'
                                            ? `${item.diasSemRetorno ?? 0} dias sem retorno`
                                            : item.atrasado && item.atrasoMotivo === 'emissao'
                                              ? 'Previsão de emissão vencida'
                                              : null;
                                    return (
                                        <tr
                                            key={doc.id}
                                            className={isSelected ? styles.rowSelected : undefined}
                                            onClick={() => setSelectedDocumentoId(doc.id)}
                                        >
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.rowButton}
                                                    onClick={() => setSelectedDocumentoId(doc.id)}
                                                >
                                                    <strong>{doc.codigo}</strong>
                                                    <span>{doc.descricao}</span>
                                                </button>
                                            </td>
                                            <td>
                                                <div className={styles.cellStack}>
                                                    <strong>{doc.disciplina ?? '—'}</strong>
                                                    <span>Classe {doc.classe ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.cellStack}>
                                                    <strong>Rev {doc.revisaoAtual ?? '—'}</strong>
                                                    <LdStatusPill code={doc.statusAtual} label={doc.statusLabel} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.cellStack}>
                                                    <strong>{doc.ultimaGrd ?? item.ultimoCiclo?.grd ?? 'Sem GRD'}</strong>
                                                    <span>
                                                        {item.ultimaMovData ? `Últ. mov.: ${formatDate(item.ultimaMovData)}` : 'Sem movimentação'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.cellStack}>
                                                    <strong>
                                                        {item.proximaPrevisao ? formatDate(item.proximaPrevisao) : 'Sem previsão futura'}
                                                    </strong>
                                                    <span className={atrasoTexto ? styles.overdueText : undefined}>
                                                        {atrasoTexto ?? 'No prazo no recorte da demo'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {insightsFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan={5}>
                                            <div className={styles.emptyInline}>
                                                <CircleAlert size={16} />
                                                Nenhum documento encontrado com os filtros atuais.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <aside className={styles.detailPane}>
                        {insightSelecionado ? (
                            <>
                                <div className={styles.detailHeader}>
                                    <div>
                                        <span className={styles.detailEyebrow}>
                                            Linha Excel {insightSelecionado.doc.linhaExcel}
                                            {insightSelecionado.doc.ocultaNoExcel ? ' • Linha oculta na planilha' : ''}
                                        </span>
                                        <h4>{insightSelecionado.doc.codigo}</h4>
                                        <p>{insightSelecionado.doc.descricao}</p>
                                    </div>
                                    <LdStatusPill
                                        code={insightSelecionado.doc.statusAtual}
                                        label={insightSelecionado.doc.statusLabel}
                                    />
                                </div>

                                <div className={styles.detailMetaGrid}>
                                    <div>
                                        <span>Disciplina</span>
                                        <strong>{insightSelecionado.doc.disciplinaLabel ?? insightSelecionado.doc.disciplina ?? '—'}</strong>
                                    </div>
                                    <div>
                                        <span>Classe</span>
                                        <strong>{insightSelecionado.doc.classe ?? '—'}</strong>
                                    </div>
                                    <div>
                                        <span>Rev atual</span>
                                        <strong>{insightSelecionado.doc.revisaoAtual ?? '—'}</strong>
                                    </div>
                                    <div>
                                        <span>Última GRD</span>
                                        <strong>{insightSelecionado.doc.ultimaGrd ?? '—'}</strong>
                                    </div>
                                    <div>
                                        <span>Previsão 1</span>
                                        <strong>{formatDate(insightSelecionado.doc.previsoesEnvio[0])}</strong>
                                    </div>
                                    <div>
                                        <span>Previsão 2</span>
                                        <strong>{formatDate(insightSelecionado.doc.previsoesEnvio[1])}</strong>
                                    </div>
                                </div>

                                {insightSelecionado.doc.observacao && (
                                    <div className={styles.noteBlock}>
                                        <Timer size={14} />
                                        <span>{insightSelecionado.doc.observacao}</span>
                                    </div>
                                )}

                                <div className={styles.timelineHeader}>
                                    <h5>
                                        <GitBranch size={15} />
                                        Histórico de revisões / envios / retornos
                                    </h5>
                                    <span>{insightSelecionado.doc.ciclos.length} ciclo(s)</span>
                                </div>

                                <div className={styles.timelineList}>
                                    {insightSelecionado.doc.ciclos.length === 0 && (
                                        <div className={styles.timelineEmpty}>Documento sem emissão registrada na planilha.</div>
                                    )}

                                    {insightSelecionado.doc.ciclos.map((ciclo) => (
                                        <article key={`${insightSelecionado.doc.id}-${ciclo.ordem}`} className={styles.timelineItem}>
                                            <div className={styles.timelineIndex}>#{ciclo.ordem}</div>
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineRow}>
                                                    <div>
                                                        <span>Envio</span>
                                                        <strong>
                                                            {ciclo.revisao ? `Rev ${ciclo.revisao}` : 'Sem revisão'} • {formatDate(ciclo.envioData)}
                                                        </strong>
                                                    </div>
                                                    <div className={styles.timelineStatusWrap}>
                                                        <LdStatusPill
                                                            code={ciclo.statusEnvio}
                                                            label={
                                                                ciclo.statusEnvio
                                                                    ? portalClienteLdData.statusLegend[ciclo.statusEnvio] ?? null
                                                                    : null
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className={styles.timelineMeta}>
                                                    <span>GRD: {ciclo.grd ?? '—'}</span>
                                                    <span>Carta: {ciclo.carta ?? '—'}</span>
                                                    <span>Cópias: {ciclo.copias ?? '—'}</span>
                                                </div>

                                                <div className={styles.timelineRow}>
                                                    <div>
                                                        <span>Retorno</span>
                                                        <strong>{ciclo.retornoData ? formatDate(ciclo.retornoData) : 'Aguardando retorno'}</strong>
                                                    </div>
                                                    <div className={styles.timelineStatusWrap}>
                                                        <LdStatusPill
                                                            code={ciclo.statusRetorno}
                                                            label={
                                                                ciclo.statusRetorno
                                                                    ? portalClienteLdData.statusLegend[ciclo.statusRetorno] ?? null
                                                                    : null
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {(ciclo.prazoDias != null || (ciclo.envioData && !ciclo.retornoData)) && (
                                                    <div className={styles.timelineFoot}>
                                                        {ciclo.prazoDias != null && <span>Prazo do ciclo: {ciclo.prazoDias} dia(s)</span>}
                                                        {ciclo.envioData && !ciclo.retornoData && (
                                                            <span className={styles.pendingCycleTag}>
                                                                {(() => {
                                                                    const envio = safeParseDate(ciclo.envioData);
                                                                    if (!envio) return 'Retorno pendente';
                                                                    return `${daysBetween(envio, DEMO_REFERENCE_DATE)} dia(s) aguardando retorno`;
                                                                })()}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.detailEmpty}>
                                <CircleAlert size={16} />
                                Selecione um documento na tabela para visualizar o histórico.
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            <footer className={styles.footerNotes}>
                <div>
                    <strong>Fonte:</strong> {portalClienteLdData.meta.fonte} • extraído em {portalClienteLdData.meta.dataExtracao}
                </div>
                <div>
                    <strong>Projeto na planilha:</strong> {portalClienteLdData.meta.projetoResumo}
                </div>
                {portalClienteLdData.meta.observacoes.map((obs) => (
                    <div key={obs}>{obs}</div>
                ))}
            </footer>
        </div>
    );
};
