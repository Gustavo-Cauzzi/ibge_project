import axios from "axios";

interface EstadoResponse {
    id: number;
    sigla: string;
    nome: string;
    regiao: {
        id: number;
        sigla: "N" | "S" | "SE" | "NE" | "CE";
        nome: "Norte" | "Sul" | "Centro-Oeste" | "Nordeste" | "Sudeste";
    };
}

export const getAllEstados = async () => {
    const response = await axios.get<EstadoResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    return response.data.map((resp) => ({ id: resp.sigla, estado: resp.nome }));
};
