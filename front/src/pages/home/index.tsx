import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiChevronDown, FiFilePlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { PessoaSearch } from "../../shared/@types/pessoa";
import { LoadingOverlay } from "../../shared/components/LoadingOverlay";
import { api } from "../../shared/services/api";
import { escolaridadeOptions } from "../form/types";
interface DefaultValues {
  idadeIni: string;
  idadeFim: string;
  escolaridade: typeof escolaridadeOptions[number] | null;
  cidade: string;
  bairro: string;
  estado: string;
}

const defaultValues: DefaultValues = {
  idadeIni: "",
  idadeFim: "",
  bairro: "",
  cidade: "",
  escolaridade: null,
  estado: "",
};

const schema = object().shape(
  {
    idadeIni: string().when("idadeFim", {
      is: "",
      then: string().matches(/^\d*$/g, "Formato inválido"),
      otherwise: string().when("idadeIni", {
        is: "",
        then: string(),
        otherwise: string()
          .matches(/^\d*$/g, "Formato inválido")
          .test("len", "Idade inicial deve ser menor que a final", function (val) {
            return Number(val) <= Number(this.parent.idadeFim);
          }),
      }),
    }),
    idadeFim: string().when("idadeIni", {
      is: "",
      then: string().matches(/^\d*$/g, "Formato inválido"),
      otherwise: string().when("idadeFim", {
        is: "",
        then: string(),
        otherwise: string()
          .matches(/^\d*$/g, "Formato inválido")
          .test("len", "Idade final deve ser maior que a inical", function (val) {
            return Number(val) >= Number(this.parent.idadeIni);
          }),
      }),
    }),
  },
  [["idadeFim", "idadeIni"]]
);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loadingInfo, setLoadingInfo] = useState({
    isLoading: false,
    text: "",
  });
  const [data, setData] = useState<PessoaSearch[]>([]);
  const [hasMadeFirstSearch, setHasMadeFirstSearch] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: DefaultValues) => {
    setHasMadeFirstSearch(true);
    setLoadingInfo({
      isLoading: true,
      text: "Buscando dados...",
    });

    const response = await api.get<PessoaSearch[]>("/pessoas/");

    setData(response.data);

    setLoadingInfo({
      isLoading: false,
      text: "",
    });
  };

  return (
    <>
      <LoadingOverlay isLoading={loadingInfo.isLoading} text={loadingInfo.text} />

      <main className="w-full gap-4 flex flex-col">
        <div className="flex w-full justify-between px-4 print:hidden">
          <h1>Consulta de pesquisas:</h1>

          <Button startIcon={<FiFilePlus size={20} />} variant="outlined" onClick={() => navigate("/form")}>
            Nova pesquisa
          </Button>
        </div>

        <form className="flex w-full flex-col gap-3 items-center" onSubmit={handleSubmit(onSubmit)}>
          <Accordion defaultExpanded className="print:hidden max-w-6xl w-full">
            <AccordionSummary expandIcon={<FiChevronDown />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography>Filtros:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex gap-2 flex-col">
                <Typography>Pessoa:</Typography>
                <div className="flex gap-1 flex-col">
                  <span>Idade:</span>
                  <div className="flex gap-2 items-center">
                    <Controller
                      control={control}
                      name="idadeIni"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="De:"
                          type="number"
                          size="small"
                          InputProps={{ inputProps: { min: 0 } }}
                          error={!!errors.idadeIni}
                          helperText={errors.idadeIni ? errors.idadeIni.message : ""}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="idadeFim"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Até:"
                          type="number"
                          size="small"
                          InputProps={{ inputProps: { min: 0 } }}
                          error={!!errors.idadeFim}
                          helperText={errors.idadeFim ? errors.idadeFim.message : ""}
                        />
                      )}
                    />
                  </div>
                </div>

                <Controller
                  control={control}
                  name="escolaridade"
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      value={field.value}
                      noOptionsText="Sem resultados"
                      onChange={(_e, newValue) => field.onChange(newValue)}
                      options={escolaridadeOptions}
                      getOptionLabel={(option) => option.description}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Escolaridade"
                          label="Escolaridade"
                          size="small"
                          error={!!errors.escolaridade}
                          helperText={errors.escolaridade ? errors.escolaridade.message : ""}
                        />
                      )}
                    />
                  )}
                />

                <hr className="my-3" />

                <Typography>Residência:</Typography>
                <div className="flex gap-2">
                  <Controller
                    control={control}
                    name="estado"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="Estado"
                        label="Estado"
                        size="small"
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
                        placeholder="Cidade"
                        label="Cidade"
                        size="small"
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
                        placeholder="Bairro"
                        label="Bairro"
                        size="small"
                        error={!!errors.bairro}
                        helperText={errors.bairro ? errors.bairro.message : ""}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex w-full justify-end px-4 print:hidden mt-5">
                <Button startIcon={<FiSearch />} variant="contained" type="submit">
                  Pesquisar
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* https://mui.com/pt/x/react-data-grid/ */}
          {hasMadeFirstSearch && (
            <div className="flex w-full justify-center items-center my-10">
              <DataGrid
                className="max-w-6xl"
                rows={data}
                columns={[
                  {
                    field: "nome",
                    headerName: "Nome",
                    flex: 1,
                  },
                  {
                    field: "idade",
                    headerName: "Idade",
                    flex: 0.3,
                  },
                  {
                    field: "escolaridade",
                    flex: 1,
                    headerName: "Escolaridade",
                    valueGetter: (p) => escolaridadeOptions[p.value - 1].description,
                  },
                  {
                    field: "estado",
                    headerName: "Estado",
                    flex: 1,
                    valueGetter: (p) => p.row.residencia.estado,
                  },
                  {
                    field: "cidade",
                    headerName: "Cidade",
                    flex: 1,
                    valueGetter: (p) => p.row.residencia.cidade,
                  },
                  {
                    field: "bairro",
                    headerName: "Bairro",
                    flex: 1,
                    valueGetter: (p) => p.row.residencia.bairro,
                  },
                ]}
                getRowId={(row) => row.cpf}
              />
            </div>
          )}
        </form>
      </main>
    </>
  );
};
