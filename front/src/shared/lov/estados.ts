import axios from "axios";

interface EstadoResponse {
    id: number;
    sigla: string;
    nome: string;
    regiao: any; // foda-se
}

export const getAllEstados = async () => {
    const response = await axios.get<EstadoResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    return response.data.map((resp) => ({ id: resp.sigla, estado: resp.nome }));
};
