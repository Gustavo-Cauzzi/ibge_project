import { Pessoa } from "../../shared/@types/pessoa";

export type IBGEForm = ResidenciaForm & { pessoas: PessoaForm[] };
export type PessoaForm = Omit<Pessoa, "residencia">;
export interface ResidenciaForm {
    cep: string;
    numero: number;
    estado: string;
    cidade: string;
    bairro: string;
}

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
    { id: 9, description: "Mestrado/Doutorado " },
];

export const escolaridadeIdPossibilities = escolaridadeOptions.map((esc) => esc.id);
