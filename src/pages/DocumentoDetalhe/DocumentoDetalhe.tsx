import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Timeline } from '../../components/common/Timeline';
import { Modal } from '../../components/common/Modal';
import { ArrowLeft, Send, CheckCircle, XCircle, DollarSign, Bot, FileText, Download, UploadCloud, Mail } from 'lucide-react';
import clsx from 'clsx';
import { Status } from '../../types';
import styles from './DocumentoDetalhe.module.css';

export const DocumentoDetalhe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { documentos, updateDocumentoStatus, setDocumentos } = useAppContext();

    const [isReprovadoModalOpen, setIsReprovadoModalOpen] = useState(false);
    const [isIaModalOpen, setIsIaModalOpen] = useState(false);
    const [motivoRejeicao, setMotivoRejeicao] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const doc = documentos.find(d => d.id === id);

    if (!doc) {
        return (
            <div className={styles.container}>
                <h2>Documento não encontrado.</h2>
                <button onClick={() => navigate('/entregaveis')}>Voltar</button>
            </div>
        );
    }

    const handleStatusUpdate = (newStatus: Status) => {
        updateDocumentoStatus(doc.id, newStatus);
    };

    const handleReprovar = () => {
        if (!motivoRejeicao) return;

        // Custom update to also set motivo
        setDocumentos(prevDocs => prevDocs.map(d => {
            if (d.id === doc.id) {
                const historyEvent = {
                    id: Math.random().toString(36).substr(2, 9),
                    dataHora: new Date().toISOString(),
                    descricao: `Documento Reprovado: ${motivoRejeicao}`,
                    responsavel: "Usuário (Demo)"
                };
                return {
                    ...d,
                    status: "Reprovado / Necessita ajuste" as Status,
                    motivoRetrabalho: motivoRejeicao,
                    historico: [...d.historico, historyEvent]
                };
            }
            return d;
        }));

        setIsReprovadoModalOpen(false);
        setMotivoRejeicao('');
    };

    const handleSimulateUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            setDocumentos(prevDocs => prevDocs.map(d => {
                if (d.id === doc.id) {
                    const historyEvent = {
                        id: Math.random().toString(36).substr(2, 9),
                        dataHora: new Date().toISOString(),
                        descricao: `Engenheiro realizou o upload do documento. Status alterado para Revisão Interna automaticamente.`,
                        responsavel: doc.responsavel
                    };
                    return {
                        ...d,
                        status: "Em revisão interna" as Status,
                        historico: [...d.historico, historyEvent]
                    };
                }
                return d;
            }));
        }, 1500);
    };

    const handleAprovarRevisao = () => {
        setDocumentos(prevDocs => prevDocs.map(d => {
            if (d.id === doc.id) {
                const historyEvent1 = {
                    id: Math.random().toString(36).substr(2, 9),
                    dataHora: new Date().toISOString(),
                    descricao: `Documento validado pelo Revisor.`,
                    responsavel: "Revisor Técnico"
                };
                const historyEvent2 = {
                    id: Math.random().toString(36).substr(2, 9),
                    dataHora: new Date().toISOString(),
                    descricao: `Automação: E-mail com anexo disparado para aprovação do cliente.`,
                    responsavel: "Sistema"
                };
                return {
                    ...d,
                    status: "Aguardando cliente" as Status,
                    historico: [...d.historico, historyEvent1, historyEvent2]
                };
            }
            return d;
        }));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className={styles.breadcrumbs}>
                            {doc.projeto} / {doc.disciplina} / {doc.pacote}
                        </div>
                        <h1 className={styles.pageTitle}>{doc.documento}</h1>
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <Badge type="status" value={doc.status} />
                    <button className={styles.iaButton} onClick={() => setIsIaModalOpen(true)}>
                        <Bot size={18} /> IA: Sugerir Passo
                    </button>
                </div>
            </header>

            <div className={styles.actionGrid}>
                {doc.status === 'Em revisão interna' && (
                    <button className={clsx(styles.actionBtn, styles.btnAutomatedReview)} onClick={handleAprovarRevisao}>
                        <Mail size={18} /> Validar e Enviar ao Cliente (Automático)
                    </button>
                )}
                <button className={clsx(styles.actionBtn, styles.btnSend)} onClick={() => handleStatusUpdate("Enviado ao cliente")}>
                    <Send size={18} /> Marcar como Enviado
                </button>
                <button className={clsx(styles.actionBtn, styles.btnApprove)} onClick={() => handleStatusUpdate("Aprovado")}>
                    <CheckCircle size={18} /> Marcar como Aprovado
                </button>
                <button className={clsx(styles.actionBtn, styles.btnReject)} onClick={() => setIsReprovadoModalOpen(true)}>
                    <XCircle size={18} /> Marcar como Reprovado
                </button>
                <button className={clsx(styles.actionBtn, styles.btnBill)} onClick={() => handleStatusUpdate("Apto a faturar")}>
                    <DollarSign size={18} /> Apto a Faturar
                </button>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.leftColumn}>

                    {/* Metadados Section */}
                    <section className={styles.card}>
                        <h3 className={styles.sectionTitle}>Resumo do Item</h3>
                        <div className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Cliente</span>
                                <span className={styles.metaValue}>{doc.cliente}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Responsável</span>
                                <span className={styles.metaValue}>{doc.responsavel}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Valor Estimado</span>
                                <span className={styles.metaValue}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(doc.valorEstimado)}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Prioridade / Risco</span>
                                <div className={styles.metaValueRow}>
                                    <Badge type="prioridade" value={doc.prioridade} />
                                    <Badge type="risco" value={doc.risco} />
                                </div>
                            </div>
                            <div className={styles.metaItemFull}>
                                <span className={styles.metaLabel}>Regra de Faturamento do Cliente</span>
                                <span className={styles.metaValueHighlight}>{doc.regraFaturamento}</span>
                            </div>
                            {doc.bloqueio && (
                                <div className={styles.metaItemFull}>
                                    <span className={styles.metaLabel}>Bloqueio Atual</span>
                                    <span className={styles.metaValueDanger}>{doc.bloqueio}</span>
                                </div>
                            )}
                            {doc.motivoRetrabalho && (
                                <div className={styles.metaItemFull}>
                                    <span className={styles.metaLabel}>Motivo de Retrabalho (Última Rejeição)</span>
                                    <span className={styles.metaValueWarning}>{doc.motivoRetrabalho}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Checklist Section */}
                    <section className={styles.card}>
                        <h3 className={styles.sectionTitle}>Checklist de Qualidade (Pré-Envio)</h3>
                        <div className={styles.checklist}>
                            <label className={styles.checkItem}>
                                <input type="checkbox" defaultChecked />
                                <span>Formatação padronizada (Template ENSISTE v4)</span>
                                <span className={styles.required}>*</span>
                            </label>
                            <label className={styles.checkItem}>
                                <input type="checkbox" defaultChecked />
                                <span>Revisão ortográfica e numeração de pranchas ok</span>
                                <span className={styles.required}>*</span>
                            </label>
                            <label className={styles.checkItem}>
                                <input type="checkbox" />
                                <span>Lista de materiais anexada (quando aplicável)</span>
                            </label>
                            <label className={styles.checkItem}>
                                <input type="checkbox" />
                                <span>Aprovação formal do Coordenador de Disciplina</span>
                                <span className={styles.required}>*</span>
                            </label>
                        </div>
                    </section>

                    {/* Anexos */}
                    <section className={styles.card}>
                        <h3 className={styles.sectionTitle}>Conteúdo e Anexos</h3>

                        {doc.status === 'Em execução' && (
                            <div className={styles.uploadArea}>
                                <div className={styles.uploadBox}>
                                    <UploadCloud size={40} className={styles.uploadIcon} />
                                    <div className={styles.uploadTexts}>
                                        <strong>Arraste o arquivo PDF/ZIP finalizado aqui</strong>
                                        <span>ou clique para buscar no seu computador</span>
                                    </div>
                                    <button
                                        className={styles.uploadBtn}
                                        onClick={handleSimulateUpload}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Fazendo Upload...' : 'Simular Upload (Demo)'}
                                    </button>
                                </div>
                                <div className={styles.uploadInfo}>
                                    <Bot size={16} /> Ao realizar o upload, a automação mudará o status para Revisão Interna e notificará o coordenador.
                                </div>
                            </div>
                        )}

                        <div className={styles.attachments}>
                            <a href="#" className={styles.attachmentLink}>
                                <FileText size={20} />
                                <div className={styles.attachmentInfo}>
                                    <strong>{doc.documento}_R0.pdf</strong>
                                    <span>Arquivo da última revisão • 2.4 MB</span>
                                </div>
                                <Download size={16} className={styles.downloadIcon} />
                            </a>
                        </div>
                    </section>

                </div>

                <div className={styles.rightColumn}>
                    {/* Histórico Section */}
                    <section className={styles.card}>
                        <h3 className={styles.sectionTitle}>Histórico e Auditoria</h3>
                        <Timeline eventos={doc.historico} />
                    </section>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isReprovadoModalOpen} onClose={() => setIsReprovadoModalOpen(false)} title="Reprovar Documento">
                <div className={styles.modalBody}>
                    <label className={styles.modalLabel}>Motivo principal (Taxonomia):</label>
                    <select
                        className={styles.modalSelect}
                        value={motivoRejeicao}
                        onChange={(e) => setMotivoRejeicao(e.target.value)}
                    >
                        <option value="">Selecione o motivo...</option>
                        <option value="Erro de cálculo / Premissa técnica errada">Erro de cálculo / Premissa técnica errada</option>
                        <option value="Incompatibilidade com outra disciplina">Incompatibilidade com outra disciplina</option>
                        <option value="Falta de detalhamento ou lista de materiais">Falta de detalhamento ou lista de materiais</option>
                        <option value="Desvio do template / Padrão visual">Desvio do template / Padrão visual</option>
                        <option value="Alteração de escopo pelo cliente (Change Order)">Alteração de escopo pelo cliente (Change Order)</option>
                    </select>

                    <button
                        className={clsx(styles.actionBtn, styles.btnReject)}
                        style={{ marginTop: '16px' }}
                        disabled={!motivoRejeicao}
                        onClick={handleReprovar}
                    >
                        Confirmar Reprovação
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isIaModalOpen} onClose={() => setIsIaModalOpen(false)} title="Sugestão de Próximo Passo" isIA>
                <div className={styles.iaModalContent}>
                    <p className={styles.iaContext}>
                        Analisando o histórico de <strong>{doc.documento}</strong> para o cliente <strong>{doc.cliente}</strong> e o status atual ({doc.status}).
                    </p>

                    <div className={styles.iaRecommendation}>
                        <h4>Ação Recomendada:</h4>
                        {doc.status === 'Aguardando cliente' ? (
                            <p>O cliente <strong>{doc.cliente}</strong> costuma demorar 12 dias em média para projetos de {doc.disciplina}. Sugiro <strong>Agendar Email Automático de Follow-up</strong> para a próxima terça-feira cobrando um parecer.</p>
                        ) : doc.status === 'Reprovado / Necessita ajuste' ? (
                            <p>O motivo de rejeição foi "<strong>{doc.motivoRetrabalho}</strong>". Sugiro agendar uma Daily rápida de 15 min entre {doc.responsavel} e a Coordenação para alinhar a premissa antes da revisão R1.</p>
                        ) : doc.status === 'Em execução' ? (
                            <p>Este documento está atrasado em relação ao cronograma estimado de {doc.projeto}. Cobrar {doc.responsavel} para entrega do R0 urgente e pular a revisão interna hierárquica usando peer-review.</p>
                        ) : (
                            <p>O documento está <strong>Aprovado</strong> e a regra diz "{doc.regraFaturamento}". Sugiro enviar imediatamente o pacote de aprovação para a fila de Pré-Faturamento do Financeiro.</p>
                        )}
                    </div>

                    <div className={styles.iaChecklist}>
                        <h4>Checklist Automático Sugerido:</h4>
                        <ul>
                            {doc.status === 'Reprovado / Necessita ajuste' && (
                                <>
                                    <li>[ ] Validar normas aplicáveis com o cliente antes da re-emissão.</li>
                                    <li>[ ] Submeter à verificação cruzada com a disciplina de Civil.</li>
                                </>
                            )}
                            {doc.status !== 'Reprovado / Necessita ajuste' && (
                                <>
                                    <li>[ ] Atualizar cronograma mestre de pacotes.</li>
                                    <li>[ ] Verificar status de documentos predecessores da disciplina.</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <button className={styles.iaActionButton} onClick={() => setIsIaModalOpen(false)}>
                        Aceitar e Aplicar Sugestão Automática (Demo)
                    </button>
                </div>
            </Modal>
        </div>
    );
};
