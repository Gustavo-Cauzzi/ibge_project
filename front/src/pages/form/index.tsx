import { Domicilio, Pessoa } from "../../shared/@types/form";
import { useState } from "react";

const initialValues: Domicilio = {
  bairro: "",
  cep: "",
  estado: "",
  cidade: "",
  numero: 0,
};

export const Form: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  return <div>form emocionante</div>;
};
