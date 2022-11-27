export type PessoaEscolaridadeValues = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Pessoa {
    nome: string;
    cpf: string;
    idade: number;
    escolaridade: PessoaEscolaridadeValues;
    residencia: number;
}

export interface PessoaSearch {
    nome: string;
    cpf: string;
    idade: number;
    escolaridade: PessoaEscolaridadeValues;
    residencia: number;
    cidade: string;
    bairro: string;
    estado: string;
}
