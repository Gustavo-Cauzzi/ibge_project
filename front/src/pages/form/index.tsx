import { Button, TextField, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FiChevronsLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { escolaridadeOptions, IBGEForm, Pessoa } from "../../shared/@types/form";
import Lov from "../../shared/components/Lov";
import { getAllEstados } from "../../shared/lov/estados";
import { PessoaForm } from "./PessoaForm";

export type FormDefaultValues = Omit<IBGEForm, "estado" | "pessoas"> & {
  estado: null | Awaited<ReturnType<typeof getAllEstados>>[number];
  pessoas: (Omit<Pessoa, "escolaridade"> & {
    escolaridade: typeof escolaridadeOptions[number];
  })[];
};

export const defaultPessoa = { cpf: "", escolaridade: escolaridadeOptions[0], idade: 0, nome: "" };

const defaultValues: FormDefaultValues = {
  bairro: "",
  cep: "",
  estado: null,
  cidade: "",
  numero: 0,
  pessoas: [defaultPessoa],
};

export const Form: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const mainColor = theme.palette.primary.main;

  const { control, handleSubmit, register } = useForm({
    defaultValues,
  });

  const onSubmit = (data: FormDefaultValues) => {
    console.log("data: ", data);
  };

  return (
    <main className="flex flex-col w-full p-3 gap-y-4">
      <h1 className="text-xl font-bold" style={{ color: mainColor }}>
        Nova pesquisa:
      </h1>

      <form id="domicilio" className="p-5 flex flex-col w-full gap-5" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl text-main">Dados do domicílio</h1>
        <div className="flex gap-2">
          <Controller
            control={control}
            name="cep"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                className="max-w-[15rem]"
                label="CEP"
                placeholder="12345-678"
              />
            )}
          />

          <Controller
            control={control}
            name="numero"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                className="max-w-[8rem]"
                label="Nº"
                type="number"
                placeholder="000"
              />
            )}
          />
        </div>

        <div className="grid w-full gap-2 grid-cols-1 xsmd:grid-cols-2 lg:grid-cols-3 justify-center">
          <Controller
            control={control}
            name="estado"
            render={({ field }) => <Lov field={field} getData={getAllEstados} placeholder="Estado" />}
          />

          <Controller
            control={control}
            name="cidade"
            render={({ field }) => <TextField {...field} fullWidth variant="outlined" label="Cidade" />}
          />
          <Controller
            control={control}
            name="bairro"
            render={({ field }) => <TextField {...field} fullWidth variant="outlined" label="Bairro" />}
          />
        </div>

        <hr className="my-2" />

        <PessoaForm control={control} register={register} />
      </form>

      <div className="flex justify-center gap-2">
        <Button startIcon={<FiChevronsLeft />} variant="outlined" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button startIcon={<FiSave />} variant="contained" type="submit" form="domicilio">
          Salvar
        </Button>
      </div>
    </main>
  );
};
