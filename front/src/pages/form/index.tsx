import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, TextField, useTheme } from "@mui/material";
import { default as searchCep } from "cep-promise";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiChevronsLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { escolaridadeOptions, IBGEForm, Pessoa } from "../../shared/@types/form";
import Lov, { ILovRef } from "../../shared/components/Lov";
import { getAllEstados } from "../../shared/lov/estados";
import { PessoaForm } from "./PessoaForm";

type EstadoOption = Awaited<ReturnType<typeof getAllEstados>>[number];

export type FormDefaultValues = Omit<IBGEForm, "estado" | "pessoas" | "numero"> & {
  estado: null | EstadoOption;
  numero: string;
  pessoas: (Omit<Pessoa, "escolaridade" | "idade"> & {
    escolaridade: typeof escolaridadeOptions[number];
    idade: string;
    key?: number;
  })[];
};

export const defaultPessoa = { cpf: "", escolaridade: escolaridadeOptions[0], idade: "", nome: "", key: 0 };

const defaultValues: FormDefaultValues = {
  bairro: "",
  cep: "",
  estado: null,
  cidade: "",
  numero: "",
  pessoas: [defaultPessoa],
};

const REQ_MSG = "Informação obrigatória";

const schema = yup.object({
  bairro: yup.string().required(REQ_MSG),
  cidade: yup.string().required(REQ_MSG),
  numero: yup.string().required(REQ_MSG).matches(/^\d*$/g, "Formato inválido"),
  cep: yup
    .string()
    .test("Cep válido", "CEP Inválido", async (value) => !!validateCep(value))
    .required(REQ_MSG),
  estado: yup
    .object({
      id: yup.string().required("Sigla não indentificada"),
      estado: yup.string().required("Nome não indentificado"),
    })
    .required(REQ_MSG)
    .typeError(REQ_MSG),
  pessoas: yup.array(
    yup.object({
      cpf: yup
        .string()
        .required(REQ_MSG)
        .test("Cpf válido", "CPF inválido", (value) => (value ? isCpfValid(value) : false)),
      escolaridade: yup.mixed().required(REQ_MSG),
      idade: yup.string().required(REQ_MSG).matches(/^\d*$/g, "Formato inválido"),
      nome: yup.string().required(REQ_MSG),
    })
  ),
});

const isCpfValid = (cep: string) => /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))$/.test(cep);

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
    getValues,
    setValue,
    clearErrors,
    formState: { errors, isDirty },
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
    clearErrors(["cidade", "bairro"]);
    if (lovRef.current) {
      const estadosOptions = lovRef.current.options as EstadoOption[];
      const estado = estadosOptions.find((estado) => estado.id === response.state);
      if (estado) {
        setValue("estado", estado);
        clearErrors("estado");
      }
    }
    setIsCepLoading(false);
  };

  const clearAddress = () => {
    setValue("estado", null);
    setValue("bairro", "");
    setValue("cidade", "");
  };

  const handleGoBack = () => {
    if (isDirty) {
      toast((t) => (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex w-full gap-1 justify-between">
              <span>O formulário está com dados modificados, tem certeza que deseja voltar?</span>
            </div>
            <div className="flex w-full justify-end gap-3">
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate(-1);
                }}
              >
                <p className="text-primary">Sim</p>
              </Button>
              <Button size="small" color="primary" variant="text" onClick={() => toast.dismiss(t.id)}>
                <p className="text-primary">Não</p>
              </Button>
            </div>
          </div>
        </>
      ));
    } else {
      navigate(-1);
    }
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
                onChange={(e) => {
                  clearAddress();
                  field.onChange(formatCep(e));
                }}
                fullWidth
                variant="outlined"
                className="max-w-[15rem]"
                label="CEP"
                placeholder="12345-678"
                disabled={isCepLoading}
                onBlur={handleSearchCep}
                InputProps={{ inputProps: { maxLength: 9 } }}
                error={!!errors.cep}
                helperText={errors.cep ? errors.cep.message : ""}
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
                error={!!errors.numero}
                helperText={errors.numero ? errors.numero.message : ""}
              />
            )}
          />
        </div>

        <div className="grid w-full gap-2 grid-cols-1 xsmd:grid-cols-2 lg:grid-cols-3 justify-center">
          <Controller
            control={control}
            name="estado"
            render={({ field }) => (
              <Lov
                field={field}
                getData={getAllEstados}
                placeholder="Estado"
                disabled={isCepLoading}
                ref={lovRef}
                error={!!errors.estado}
                helperText={errors.estado ? errors.estado.message : ""}
              />
            )}
          />

          <Controller
            control={control}
            name="cidade"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Cidade"
                disabled={isCepLoading}
                error={!!errors.cidade}
                helperText={errors.cidade ? errors.cidade.message : ""}
              />
            )}
          />
          <Controller
            control={control}
            name="bairro"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Bairro"
                disabled={isCepLoading}
                error={!!errors.bairro}
                helperText={errors.bairro?.message}
              />
            )}
          />
        </div>

        <hr className="my-2" />

        <PessoaForm errors={errors} control={control} />
      </form>

      <div className="flex justify-center gap-2">
        <Button startIcon={<FiChevronsLeft />} variant="outlined" onClick={handleGoBack}>
          Voltar
        </Button>
        <Button startIcon={<FiSave />} variant="contained" type="submit" form="domicilio">
          Salvar
        </Button>
      </div>
    </main>
  );
};
