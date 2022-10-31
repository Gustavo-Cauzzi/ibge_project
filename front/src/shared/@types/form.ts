export type IBGEForm = Domicilio & Pessoa[];

export interface Pessoa {
    cpf: string;
    nome: string;
    idade: string;
    escolaridade: 1 | 2 | 3 | 4 | 5; // A definir...
    // idResidencia no banco
}

export interface Domicilio {
    idResidencia?: number; // Incremental do banco (n mandado pelo front) pk
    cep: string; //
    numero: number; // uk

    // Buscado através do CEP (procurar api)
    estado: string;
    cidade: string;
    bairro: string;
}

// Tabela de Pessoas:
//  Pessoa + idResidencia

// Tabela de Domicilios
//
