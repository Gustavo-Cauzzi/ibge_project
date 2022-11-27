import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiChevronDown, FiDownload, FiFilePlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { PessoaSearch } from "../../shared/@types/pessoa";
import { LoadingOverlay } from "../../shared/components/LoadingOverlay";
import { api } from "../../shared/services/api";
import exportToXLSX from "../../shared/utils/exportToXLSX";
import { escolaridadeOptions } from "../form/types";
import { HomeAnalytics } from "./HomeAnalytics";
import "./styles.scss";

interface DefaultValues {
  idadeIni: string;
  idadeFim: string;
  escolaridade: typeof escolaridadeOptions;
  cidade: string;
  bairro: string;
  estado: string;
}

const defaultValues: DefaultValues = {
  idadeIni: "",
  idadeFim: "",
  bairro: "",
  cidade: "",
  escolaridade: [],
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
  const [pageSize, setPageSize] = useState(10);
  const [loadingInfo, setLoadingInfo] = useState({
    isLoading: false,
    text: "",
  });
  const [data, setData] = useState<PessoaSearch[]>([]);
  const [hasMadeFirstSearch, setHasMadeFirstSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // https://react-hook-form.com/
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // Executar a busca dos dados quando a tela é carregada
  useEffect(() => void onSubmit(getValues()), []);

  const onSubmit = async (data: DefaultValues) => {
    setHasMadeFirstSearch(true);
    setLoadingInfo({
      isLoading: true,
      text: "Buscando dados...",
    });

    const response = await api.get<PessoaSearch[]>("/pessoas/", {
      params: {
        residencia__cidade: data.cidade,
        residencia__bairro: data.bairro,
        residencia__estado: data.estado,
      },
    });

    const escolaridadeIds = data.escolaridade.map((escolaridade) => escolaridade.id);

    setData(
      response.data.filter(
        (pessoa) =>
          (data.idadeIni ? Number(data.idadeIni) <= pessoa.idade : true) &&
          (data.idadeFim ? Number(data.idadeFim) >= pessoa.idade : true) &&
          (escolaridadeIds.length ? escolaridadeIds.includes(pessoa.escolaridade) : true)
      )
    );

    setLoadingInfo({
      isLoading: false,
      text: "",
    });
  };

  const handleExportPdf = () => {
    const previousPageSize = pageSize;
    setPageSize(100);
    window.print();
    setPageSize(previousPageSize);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleExportXlsx = () => {
    const parsedData = data.map(({ residencia, ...row }) => ({
      ...row,
      escolaridade: escolaridadeOptions[row.escolaridade - 1].description,
    }));
    exportToXLSX(parsedData, "Dados-ibge");
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

        <form className="flex w-full mt-9 flex-col gap-3 items-center" onSubmit={handleSubmit(onSubmit)}>
          <Accordion className="print:hidden max-w-6xl w-full">
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
                      multiple
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
            <Paper className="flex w-full flex-col justify-center items-center my-10 max-w-6xl">
              <div className="flex w-full justify-end print:hidden">
                <Button startIcon={<FiDownload />} onClick={handleClick}>
                  Exportar
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem
                    onClick={() => {
                      handleExportPdf();
                      setAnchorEl(null);
                    }}
                  >
                    PDF
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleExportXlsx();
                      setAnchorEl(null);
                    }}
                  >
                    XLSX
                  </MenuItem>
                </Menu>
              </div>
              <DataGrid
                className="max-w-6xl grow w-full"
                rows={data}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
                    valueGetter: (p) => p.row.estado,
                  },
                  {
                    field: "cidade",
                    headerName: "Cidade",
                    flex: 1,
                    valueGetter: (p) => p.row.cidade,
                  },
                  {
                    field: "bairro",
                    headerName: "Bairro",
                    flex: 1,
                    valueGetter: (p) => p.row.bairro,
                  },
                ]}
                getRowId={(row) => row.cpf}
              />
            </Paper>
          )}
        </form>

        <div className="flex w-full justify-center mb-10">
          <HomeAnalytics data={data} />
        </div>
      </main>
    </>
  );
};
