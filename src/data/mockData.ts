import { Documento, Status } from '../types';

export const initialMockData: Documento[] = [
    {
        id: "doc-1",
        projeto: "PCH Caju",
        cliente: "EnergyCorp",
        disciplina: "Civil",
        pacote: "Fundações",
        documento: "Projeto Básico - Casa de Força",
        responsavel: "Carlos Lima",
        status: "Aguardando cliente",
        valorEstimado: 125000,
        dataCriacao: "2024-05-10T10:00:00Z",
        dataEnvio: "2024-05-15T14:30:00Z",
        bloqueio: "Aprovação pendente da diretoria do cliente",
        regraFaturamento: "Faturamento 30 dias após aprovação",
        linkArquivo: "https://repositorio.ensiste/doc1",
        risco: "Alto",
        prioridade: 5,
        historico: [
            { id: "ev1", dataHora: "2024-05-10T10:00:00Z", descricao: "Documento criado", responsavel: "Sistema" },
            { id: "ev2", dataHora: "2024-05-15T14:30:00Z", descricao: "Enviado ao cliente via portal", responsavel: "Carlos Lima" }
        ]
    },
    {
        id: "doc-2",
        projeto: "Subestação 230kV",
        cliente: "Transmissora Sul",
        disciplina: "Elétrica",
        pacote: "Arranjo Físico",
        documento: "Planta de Situação e Arranjo",
        responsavel: "Mariana Silva",
        status: "Em execução",
        valorEstimado: 85000,
        dataCriacao: "2024-05-20T09:15:00Z",
        bloqueio: "Aguardando levantamento topográfico",
        regraFaturamento: "Pagamento imediato na entrega",
        linkArquivo: "https://repositorio.ensiste/doc2",
        risco: "Médio",
        prioridade: 4,
        historico: [
            { id: "ev3", dataHora: "2024-05-20T09:15:00Z", descricao: "Documento criado", responsavel: "Sistema" }
        ]
    },
    {
        id: "doc-3",
        projeto: "UTE TermoCerrado",
        cliente: "BioGas Brasil",
        disciplina: "Mecânica",
        pacote: "Tubulação",
        documento: "Isométricos Linha Principal",
        responsavel: "Roberto Mendes",
        status: "Reprovado / Necessita ajuste",
        valorEstimado: 45000,
        dataCriacao: "2024-05-02T11:00:00Z",
        dataEnvio: "2024-05-08T16:00:00Z",
        dataRetorno: "2024-05-19T08:30:00Z",
        motivoRetrabalho: "Incompatibilidade de normas de material nas juntas (ASME vs API)",
        regraFaturamento: "100% no Aceite Final",
        linkArquivo: "https://repositorio.ensiste/doc3",
        risco: "Alto",
        prioridade: 5,
        historico: [
            { id: "ev4", dataHora: "2024-05-02T11:00:00Z", descricao: "Documento criado", responsavel: "Sistema" },
            { id: "ev5", dataHora: "2024-05-08T16:00:00Z", descricao: "Enviado ao cliente via e-mail", responsavel: "Roberto Mendes" },
            { id: "ev6", dataHora: "2024-05-19T08:30:00Z", descricao: "Rejeitado pelo cliente", responsavel: "Cliente Portal" }
        ]
    },
    {
        id: "doc-4",
        projeto: "PCH Caju",
        cliente: "EnergyCorp",
        disciplina: "Estruturas",
        pacote: "Barragem",
        documento: "Memória de Cálculo Vertedouro",
        responsavel: "Fernanda Costa",
        status: "Apto a faturar",
        valorEstimado: 210000,
        dataCriacao: "2024-04-10T10:00:00Z",
        dataEnvio: "2024-05-01T10:00:00Z",
        dataRetorno: "2024-05-22T15:20:00Z",
        regraFaturamento: "Faturamento 30 dias após aprovação",
        linkArquivo: "https://repositorio.ensiste/doc4",
        risco: "Baixo",
        prioridade: 5,
        historico: [
            { id: "ev7", dataHora: "2024-05-01T10:00:00Z", descricao: "Enviado", responsavel: "Fernanda Costa" },
            { id: "ev8", dataHora: "2024-05-22T15:20:00Z", descricao: "Aprovado sem ressalvas", responsavel: "Cliente" },
            { id: "ev9", dataHora: "2024-05-22T16:00:00Z", descricao: "Marcado como apto a faturar", responsavel: "Sistema (Automação)" }
        ]
    },
    {
        id: "doc-5",
        projeto: "Planta Solar Nordeste",
        cliente: "SunPower",
        disciplina: "Elétrica",
        pacote: "Placas Fotovoltaicas",
        documento: "Diagrama Unifilar",
        responsavel: "João Almeida",
        status: "Em revisão interna",
        valorEstimado: 32000,
        dataCriacao: "2024-05-18T14:45:00Z",
        bloqueio: "Verificação com Coord. Civil Pendente",
        regraFaturamento: "30% Entrada / 70% Entrega",
        linkArquivo: "https://repositorio.ensiste/doc5",
        risco: "Baixo",
        prioridade: 3,
        historico: [
            { id: "ev10", dataHora: "2024-05-18T14:45:00Z", descricao: "Criado", responsavel: "Sistema" },
            { id: "ev11", dataHora: "2024-05-23T09:00:00Z", descricao: "Movido para revisão", responsavel: "João Almeida" }
        ]
    },
    {
        id: "doc-6",
        projeto: "Linha de Transmissão 500kV",
        cliente: "EletroRede",
        disciplina: "Estudos Elétricos",
        pacote: "Curto-Circuito",
        documento: "Relatório de Proteção",
        responsavel: "Mariana Silva",
        status: "Aguardando cliente",
        valorEstimado: 120000,
        dataCriacao: "2024-04-20T10:00:00Z",
        dataEnvio: "2024-05-05T11:00:00Z",
        bloqueio: "Cliente não enviou parâmetros atualizados da subestação lindeira",
        regraFaturamento: "Marco 2 - Estudos de Rede (100%)",
        linkArquivo: "https://repositorio.ensiste/doc6",
        risco: "Alto",
        prioridade: 5,
        historico: [
            { id: "ev12", dataHora: "2024-05-05T11:00:00Z", descricao: "Enviado R0", responsavel: "Mariana Silva" }
        ]
    },
    {
        id: "doc-7",
        projeto: "Expansão Fábrica Celulose",
        cliente: "PapelBR",
        disciplina: "Instrumentação",
        pacote: "Automação",
        documento: "Arquitetura de Redes Industriais",
        responsavel: "Luiz Pires",
        status: "Aprovado",
        valorEstimado: 75000,
        dataCriacao: "2024-05-01T08:00:00Z",
        dataEnvio: "2024-05-15T09:30:00Z",
        dataRetorno: "2024-05-24T14:15:00Z",
        regraFaturamento: "Faturamento 15dd Fim do Mês",
        linkArquivo: "https://repositorio.ensiste/doc7",
        risco: "Baixo",
        prioridade: 2,
        historico: [
            { id: "ev13", dataHora: "2024-05-15T09:30:00Z", descricao: "Enviado", responsavel: "Luiz Pires" },
            { id: "ev14", dataHora: "2024-05-24T14:15:00Z", descricao: "Aprovado pelo cliente", responsavel: "Portal do Cliente" }
        ]
    },
    {
        id: "doc-8",
        projeto: "Refinaria Litoral",
        cliente: "PetroNacional",
        disciplina: "Processos",
        pacote: "PFD/P&ID",
        documento: "P&ID Unidade de Tratamento",
        responsavel: "Rafael Gomes",
        status: "Faturado",
        valorEstimado: 150000,
        dataCriacao: "2024-02-15T10:00:00Z",
        dataEnvio: "2024-03-20T13:00:00Z",
        dataRetorno: "2024-04-10T11:00:00Z",
        regraFaturamento: "Condição Padrão",
        linkArquivo: "https://repositorio.ensiste/doc8",
        risco: "Baixo",
        prioridade: 1,
        historico: [
            { id: "ev15", dataHora: "2024-04-10T11:00:00Z", descricao: "Aprovado", responsavel: "Cliente" },
            { id: "ev16", dataHora: "2024-04-30T10:00:00Z", descricao: "Nota Fiscal Emitida", responsavel: "Financeiro" }
        ]
    },
    {
        id: "doc-9",
        projeto: "Parque Eólico Sul",
        cliente: "VentoVerde",
        disciplina: "Civil",
        pacote: "Acessos",
        documento: "Projeto Geométrico Vias Internas",
        responsavel: "Carlos Lima",
        status: "Em execução",
        valorEstimado: 60000,
        dataCriacao: "2024-05-22T08:00:00Z",
        regraFaturamento: "Mensal por medição de horas",
        linkArquivo: "https://repositorio.ensiste/doc9",
        risco: "Baixo",
        prioridade: 4,
        historico: [
            { id: "ev17", dataHora: "2024-05-22T08:00:00Z", descricao: "Atribuído a Carlos Lima", responsavel: "Coordenação" }
        ]
    },
    {
        id: "doc-10",
        projeto: "Parque Eólico Sul",
        cliente: "VentoVerde",
        disciplina: "Civil",
        pacote: "Acessos",
        documento: "Estudo Hidrológico e Drenagem",
        responsavel: "Carlos Lima",
        status: "Aguardando cliente",
        valorEstimado: 45000,
        dataCriacao: "2024-04-22T08:00:00Z",
        dataEnvio: "2024-05-10T17:00:00Z",
        bloqueio: "Dúvida Comercial",
        regraFaturamento: "Mensal por medição de horas",
        linkArquivo: "https://repositorio.ensiste/doc10",
        risco: "Médio",
        prioridade: 3,
        historico: [
            { id: "ev18", dataHora: "2024-05-10T17:00:00Z", descricao: "Enviado R0", responsavel: "Carlos" }
        ]
    },
    {
        id: "doc-11",
        projeto: "Subestação 230kV",
        cliente: "Transmissora Sul",
        disciplina: "Elétrica",
        pacote: "Painéis e SPCS",
        documento: "Diagrama Esquemático de Proteção",
        responsavel: "Mariana Silva",
        status: "Em revisão interna",
        valorEstimado: 110000,
        dataCriacao: "2024-05-15T09:00:00Z",
        bloqueio: "Gargalo no departamento de qualidade (FILA)",
        regraFaturamento: "Pagamento contra-entrega",
        linkArquivo: "https://repositorio.ensiste/doc11",
        risco: "Baixo",
        prioridade: 4,
        historico: [
            { id: "ev19", dataHora: "2024-05-15T09:00:00Z", descricao: "Criado", responsavel: "Sistema" }
        ]
    },
    {
        id: "doc-12",
        projeto: "UTE TermoCerrado",
        cliente: "BioGas Brasil",
        disciplina: "Mecânica",
        pacote: "Equipamentos Especiais",
        documento: "Folha de Dados Trocador de Calor",
        responsavel: "Roberto Mendes",
        status: "Reprovado / Necessita ajuste",
        valorEstimado: 38000,
        dataCriacao: "2024-05-01T10:00:00Z",
        dataEnvio: "2024-05-12T14:00:00Z",
        dataRetorno: "2024-05-18T16:00:00Z",
        motivoRetrabalho: "Erro de cálculo termodinâmico nas premissas base",
        regraFaturamento: "100% no Aceite Final",
        linkArquivo: "https://repositorio.ensiste/doc12",
        risco: "Alto",
        prioridade: 5,
        historico: [
            { id: "ev20", dataHora: "2024-05-12T14:00:00Z", descricao: "Enviado", responsavel: "Roberto" },
            { id: "ev21", dataHora: "2024-05-18T16:00:00Z", descricao: "Comentários extensos apontando falha técnica", responsavel: "Cliente" }
        ]
    }
];
