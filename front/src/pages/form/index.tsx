import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../shared/services/api";
import { Button, CircularProgress, TextField, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiChevronsLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { escolaridadeOptions, IBGEForm, PessoaForm as PessoaFormType } from "./types";
import Lov, { ILovRef } from "../../shared/components/Lov";
import { getAllEstados } from "../../shared/lov/estados";
import { PessoaForm } from "./PessoaForm";
import { Residencia } from "../../shared/@types/residencia";
import { formatCep, formatCepApi, formatCpf, formatCpfApi, isCpfValid, validateCep } from "../../shared/utils/utils";
import { Pessoa } from "../../shared/@types/pessoa";
import { LoadingOverlay } from "../../shared/components/LoadingOverlay";

type EstadoOption = Awaited<ReturnType<typeof getAllEstados>>[number];

export type FormDefaultValues = Omit<IBGEForm, "estado" | "pessoas" | "numero"> & {
  estado: null | EstadoOption;
  numero: string;
  pessoas: (Omit<PessoaFormType, "escolaridade" | "idade"> & {
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

const formatCepEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.value = formatCep(e.target.value);
  return e;
};

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

export const Form: React.FC = () => {
  const [loadingInfo, setLoadingInfo] = useState({
    isLoading: false,
    text: "",
  });
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

  const onSubmit = async (data: FormDefaultValues) => {
    if (!data.estado) {
      toast.error("Preencha os dados");
      return;
    }

    try {
      const { id } = await handleSaveResidencia(data);
      await handleSavePessoas(data.pessoas, id!);
      toast.success("Dados salvos com sucesso");
      navigate("/");
    } catch (e) {}

    setLoadingInfo({
      isLoading: false,
      text: "",
    });
  };

  const handleSaveResidencia = async (data: FormDefaultValues) => {
    try {
      setLoadingInfo({
        isLoading: true,
        text: "Salvando residência...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const residenciaResponse = await api.post<Residencia>("/residencias/", {
        bairro: data.bairro,
        cep: formatCepApi(data.cep),
        cidade: data.cidade,
        estado: data.estado?.estado,
        numero: Number(data.numero),
      } as Residencia);

      return residenciaResponse.data;
    } catch (e) {
      toast.error("Residência já cadastrada!");
      throw e;
    }
  };

  const handleSavePessoas = async (pessoas: FormDefaultValues["pessoas"], idResidencia: number) => {
    try {
      setLoadingInfo({
        isLoading: true,
        text: "Salvando pessoas...",
      });

      await Promise.all(
        pessoas.map((pessoa) =>
          api.post("/pessoas/", {
            cpf: formatCpfApi(pessoa.cpf),
            escolaridade: pessoa.escolaridade.id,
            idade: Number(pessoa.idade),
            nome: pessoa.nome,
            residencia: idResidencia,
          } as Pessoa)
        )
      );
    } catch (e) {
      toast.error("Pessoa(s) já cadastrada(s)!");
      console.log("delete");
      api.delete(`/residencias/${idResidencia}`);
      console.log("delete2");
      throw e;
    }
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
    <>
      <LoadingOverlay isLoading={loadingInfo.isLoading} text={loadingInfo.text ?? "Carregando..."} />

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
                    field.onChange(formatCepEvent(e));
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
    </>
  );
};
