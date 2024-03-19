export type Cargos = "Membro" | "Núcleo" | "Lider" | "Supervisor";

export type Parcela = {
    quantidade: string,
    comprovante: string
}

export type Venda = {
    quantidade?: string,
    valor: number,
    produto: string,
    data?: string,

    pago?: boolean
}

export interface Inscrito {
    celula?: string | number;
    cpf: string;
    parcelas?: string | Parcela[];
    cargo?: Cargos;
    nome?: string;
    sexo?: string;
    dataNascimento?: string;
    telefone?: string;
    observacao?: string;
    documentos?: string[];
    convidado?: boolean;
    vendinha?: Venda[];
}