import { CircularProgress } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { PessoaSearch } from "../../../shared/@types/pessoa";
import { colorScheme4, groupByAndMap, mapToArray } from "../../../shared/utils/utils";
import { escolaridadeOptions } from "../../form/types";

interface EscolaridadeRealationProps {
  data: PessoaSearch[];
  colorScheme?: `#${string}`[];
}

export const EscolaridadeRealation: React.FC<EscolaridadeRealationProps> = ({ data, colorScheme = colorScheme4 }) => {
  const [loading, setLoading] = useState(false);

  const escolaridadeValues = mapToArray(
    groupByAndMap(
      data,
      (val) => val.escolaridade,
      (group) =>
        group.reduce((acc) => {
          acc++;
          return acc;
        }, 0)
    ),
    (escolaridadeId, total) => ({
      id: escolaridadeId,
      total,
      escolaridadeName: escolaridadeOptions[escolaridadeId - 1].description,
    })
  ).sort((a, b) => b.total - a.total);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Força o componente do gráfico a recarreagar desrenderizando ele e rederizando novamente
      // Vide axioma 1 da métodologia XGH
      // https://gohorseprocess.com.br/extreme-go-horse-xgh/#:~:text=1%2D%20Pensou%2C%20n%C3%A3o%20%C3%A9%20XGH.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    })();
  }, [data]);

  const escolaridadeConfig: (data: typeof escolaridadeValues) => ApexOptions = (data2) => ({
    legend: {
      formatter: (_value, opts) => data2[opts.seriesIndex].escolaridadeName,
    },
    chart: {
      type: "donut",
    },
    colors: colorScheme,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    tooltip: {
      y: {
        title: {
          formatter: (_value: any, opts: { seriesIndex: number }) => {
            return data2[opts.seriesIndex].escolaridadeName;
          },
        } as any, // aaaaaaaa typescript errado da lib!!!!!!!
      },
    },
  });

  return loading ? (
    <div className="w-full flex justify-center items-center">
      <CircularProgress />
    </div>
  ) : escolaridadeValues.length === 0 ? (
    <>Nenhum dado informado</>
  ) : (
    <Chart
      options={escolaridadeConfig(escolaridadeValues)}
      series={escolaridadeValues.map((v) => v.total)}
      type="donut"
      width="600"
    />
  );
};
