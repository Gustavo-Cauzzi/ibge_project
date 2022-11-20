import { default as searchCep } from "cep-promise";

export const isCpfValid = (cep: string) => /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))$/.test(cep);

export const formatCep = (cep: string) => cep.replaceAll(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2");

export const validateCep = async (cep: string | undefined) => {
    if (!cep) return;

    if (!/^[0-9]{5}-[0-9]{3}$/.test(cep)) return;

    try {
        return await searchCep(cep);
    } catch (e) {
        return;
    }
};

export const formatCpf = (cpf: string) =>
    cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const formatCepApi = (cep: string) => cep.replace("-", "");

export const formatCpfApi = (cpf: string) => cpf.replaceAll(".", "").replace("-", "");
