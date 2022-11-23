import { PessoaSearch } from "../../shared/@types/pessoa";
import { EscolaridadeRealation } from "./Charts/EscolaridadeRealation";

interface HomeAnalyticsProps {
  data: PessoaSearch[];
}

export const HomeAnalytics: React.FC<HomeAnalyticsProps> = ({ data }) => {
  return data.length ? (
    <>
      <EscolaridadeRealation data={data} />
      {/* Quem sabe mais gráficos ...? */}
    </>
  ) : (
    <></>
  );
};
