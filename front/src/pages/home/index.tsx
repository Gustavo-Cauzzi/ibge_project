import { Button } from "@mui/material";
import { FiFilePlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full gap-4 flex flex-col">
      <div className="flex w-full justify-between px-4">
        <h1>Consulta de pesquisas:</h1>

        <Button startIcon={<FiFilePlus size={20} />} variant="contained" onClick={() => navigate("/form")}>
          Nova pesquisa
        </Button>
      </div>
    </main>
  );
};
