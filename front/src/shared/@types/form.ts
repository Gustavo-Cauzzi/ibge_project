export type IBGEForm = Domicilio & { pessoas: Pessoa[] };

export interface Pessoa {
    cpf: string;
    nome: string;
    idade: number;
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

type Option = { id: number; description: string };
export const escolaridadeOptions: Option[] = [
    { id: 1, description: "Analfabeto" },
    { id: 2, description: "Ensino básico" },
    { id: 3, description: "Fundamental incompleto" },
    { id: 4, description: "Fundamental completo" },
    { id: 5, description: "Ensino médio incompleto" },
    { id: 6, description: "Ensino médio completo" },
    { id: 7, description: "Ensino superior incompleto" },
    { id: 8, description: "Ensino superior completo" },
    { id: 9, description: "Metrado/Doutorado " },
];
