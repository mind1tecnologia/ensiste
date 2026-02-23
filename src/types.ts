export type Status =
    | "Em execução"
    | "Em revisão interna"
    | "Enviado ao cliente"
    | "Aguardando cliente"
    | "Aprovado"
    | "Reprovado / Necessita ajuste"
    | "Apto a faturar"
    | "Faturado";

export type Risco = "Baixo" | "Médio" | "Alto";
export type Prioridade = 1 | 2 | 3 | 4 | 5;

export interface EventoHistorico {
    id: string;
    dataHora: string; // ISO string
    descricao: string;
    responsavel: string;
}

export interface Documento {
    id: string;
    projeto: string;
    cliente: string;
    disciplina: string;
    pacote: string;
    documento: string;
    responsavel: string;
    status: Status;
    valorEstimado: number;
    dataCriacao: string; // ISO string
    dataEnvio?: string;
    dataRetorno?: string;
    bloqueio?: string; // e.g. "Aguardando assinatura", "Revisão interna pendente"
    motivoRetrabalho?: string;
    regraFaturamento: string;
    linkArquivo: string;
    risco: Risco;
    prioridade: Prioridade;
    historico: EventoHistorico[];
}
