import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FiChevronDown, FiFilePlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { escolaridadeOptions } from "../form/types";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full gap-4 flex flex-col">
      <div className="flex w-full justify-between px-4">
        <h1>Consulta de pesquisas:</h1>

        <Button startIcon={<FiFilePlus size={20} />} variant="outlined" onClick={() => navigate("/form")}>
          Nova pesquisa
        </Button>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<FiChevronDown />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>Filtros:</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex gap-2 flex-col">
              <Typography>Pessoa:</Typography>
              <div className="flex gap-1 flex-col">
                <span>Idade:</span>
                <div className="flex gap-2 items-center">
                  <TextField label="De:" type="number" size="small" InputProps={{ inputProps: { min: 0 } }} />
                  <TextField label="Até:" type="number" size="small" InputProps={{ inputProps: { min: 0 } }} />
                </div>
              </div>

              <Autocomplete
                // {...field}
                // value={field.value}
                noOptionsText="Sem resultados"
                // onChange={(_e, newValue) => field.onChange(newValue)}
                options={escolaridadeOptions}
                getOptionLabel={(option) => option.description}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Escolaridade"
                    label="Escolaridade"
                    size="small"
                    // error={!!errors[i]?.escolaridade}
                    // helperText={errors[i]?.escolaridade?.message ?? ""}
                  />
                )}
              />

              <hr className="my-3" />

              <Typography>Residência:</Typography>
              <div className="flex gap-2">
                <TextField
                  fullWidth
                  placeholder="Estado"
                  label="Estado"
                  size="small"
                  // error={!!errors[i]?.escolaridade}
                  // helperText={errors[i]?.escolaridade?.message ?? ""}
                />

                <TextField
                  fullWidth
                  placeholder="Cidade"
                  label="Cidade"
                  size="small"
                  // error={!!errors[i]?.escolaridade}
                  // helperText={errors[i]?.escolaridade?.message ?? ""}
                />

                <TextField
                  fullWidth
                  placeholder="Bairro"
                  label="Bairro"
                  size="small"
                  // error={!!errors[i]?.escolaridade}
                  // helperText={errors[i]?.escolaridade?.message ?? ""}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <div className="flex w-full justify-end px-4">
          <Button startIcon={<FiSearch />} variant="contained">
            Pesquisar
          </Button>
        </div>

        <DataGrid rows={[]} columns={[]} />
      </div>
    </main>
  );
};
