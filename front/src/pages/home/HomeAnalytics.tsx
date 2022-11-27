import { Paper } from "@mui/material";
import { PessoaSearch } from "../../shared/@types/pessoa";
import { EscolaridadeRealation } from "./Charts/EscolaridadeRealation";
import "./styles.scss";

interface HomeAnalyticsProps {
  data: PessoaSearch[];
}

export const HomeAnalytics: React.FC<HomeAnalyticsProps> = ({ data }) => {
  return data.length ? (
    <div className="flex w-full justify-center items-center max-w-6xl font-bold hidden-container">
      <Paper className="w-full p-6 flex gap-4 flex-col items-center">
        <h1 className="text-2xl text-[#7E22CE] w-full">Porcentagem de escolaridades</h1>

        <EscolaridadeRealation data={data} />
      </Paper>
      {/* Quem sabe mais gráficos ...? */}
    </div>
  ) : (
    <></>
  );
};
