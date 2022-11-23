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

export function groupBy<K, V>(array: V[], grouper: (item: V) => K) {
    return array.reduce((store, item) => {
        const key = grouper(item);
        if (!store.has(key)) {
            store.set(key, [item]);
        } else {
            store.get(key)?.push(item);
        }
        return store;
    }, new Map<K, V[]>());
}

export function groupByAndMap<T, K, R>(array: T[], grouper: (x: T) => K, mapper: (x: T[]) => R) {
    const groups = groupBy(array, grouper);
    return transformMap(groups, (value) => mapper(value));
}

export function transformMap<K, V, R>(source: Map<K, V>, transformer: (value: V, key: K) => R) {
    return new Map(Array.from(source, (v) => [v[0], transformer(v[1], v[0])]));
}

export function mapToArray<K, V, R>(m: Map<K, V>, transformer: (key: K, item: V) => R) {
    return Array.from(m.entries()).map((x) => transformer(x[0], x[1]));
}

export const colorScheme1 = ["#7E22CE", "#E500A3", "#FF3374", "#FF8150", "#FFC148", "#F9F871"];
export const colorScheme2 = ["#7E22CE", "#A347F2", "#C76AFF", "#ED8CFF", "#FFAFFF"];
export const colorScheme3 = ["#7E22CE", "#0061FD", "#0098FA", "#00A9D0", "#00B69C"];
