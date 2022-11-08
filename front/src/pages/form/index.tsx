import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, TextField, useTheme } from "@mui/material";
import { default as searchCep } from "cep-promise";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiChevronsLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { escolaridadeOptions, IBGEForm, Pessoa } from "../../shared/@types/form";
import Lov, { ILovRef } from "../../shared/components/Lov";
import { getAllEstados } from "../../shared/lov/estados";
import { PessoaForm } from "./PessoaForm";
import { useState, useRef } from "react";

type EstadoOption = Awaited<ReturnType<typeof getAllEstados>>[number];

export type FormDefaultValues = Omit<IBGEForm, "estado" | "pessoas"> & {
  estado: null | EstadoOption;
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

const REQ_MSG = "Informação obrigatória";

const schema = yup.object({
  bairro: yup.string().required(REQ_MSG),
  cidade: yup.string().required(REQ_MSG),
  numero: yup.number().integer("Número inválido").required(REQ_MSG),
  cep: yup
    .string()
    .test("Cep válido", "CEP Inválido", async (value) => !!validateCep(value))
    .required(REQ_MSG),
  estado: yup
    .object({
      sigla: yup.string().required("Sigla não indentificada"),
      nome: yup.string().required("Nome não indentificado"),
    })
    .required(REQ_MSG),
});

const formatCep = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.value = e.target.value.replaceAll(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2");
  return e;
};

const validateCep = async (cep: string | undefined) => {
  if (!cep) return;

  if (!/^[0-9]{5}-[0-9]{3}$/.test(cep)) return;

  try {
    return await searchCep(cep);
  } catch (e) {
    return;
  }
};

export const Form: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const mainColor = theme.palette.primary.main;
  const [isCepLoading, setIsCepLoading] = useState(false);

  const lovRef = useRef<ILovRef>(null);

  const {
    control,
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  const onSubmit = (data: FormDefaultValues) => {
    console.log("data: ", data);
  };

  const handleSearchCep = async () => {
    setIsCepLoading(true);
    const cep = getValues("cep");
    const response = await validateCep(cep);
    if (!response) {
      setIsCepLoading(false);
      return;
    }

    setValue("bairro", response.neighborhood);
    setValue("cidade", response.city);
    if (lovRef.current) {
      const estadosOptions = lovRef.current.options as EstadoOption[];
      const estado = estadosOptions.find((estado) => estado.id === response.state);
      if (estado) {
        setValue("estado", estado);
      }
    }
    setIsCepLoading(false);
  };

  return (
    <main className="flex flex-col w-full p-3 gap-y-4">
      <h1 className="text-xl font-bold" style={{ color: mainColor }}>
        Nova pesquisa:
      </h1>

      <form id="domicilio" className="p-5 flex flex-col w-full gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full justify-between">
          <h1 className="text-3xl text-main">Dados do domicílio</h1>

          {isCepLoading && <CircularProgress />}
        </div>
        <div className="flex gap-2">
          <Controller
            control={control}
            name="cep"
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(formatCep(e))}
                fullWidth
                variant="outlined"
                className="max-w-[15rem]"
                label="CEP"
                placeholder="12345-678"
                disabled={isCepLoading}
                onBlur={handleSearchCep}
                InputProps={{ inputProps: { maxLength: 9 } }}
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
            render={({ field }) => (
              <Lov field={field} getData={getAllEstados} placeholder="Estado" disabled={isCepLoading} ref={lovRef} />
            )}
          />

          <Controller
            control={control}
            name="cidade"
            render={({ field }) => (
              <TextField {...field} fullWidth variant="outlined" label="Cidade" disabled={isCepLoading} />
            )}
          />
          <Controller
            control={control}
            name="bairro"
            render={({ field }) => (
              <TextField {...field} fullWidth variant="outlined" label="Bairro" disabled={isCepLoading} />
            )}
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
