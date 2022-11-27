import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { PessoaSearch } from "../../../shared/@types/pessoa";
import { colorScheme4, groupByAndMap, mapToArray } from "../../../shared/utils/utils";
import { escolaridadeOptions } from "../../form/types";

interface EscolaridadeRealationProps {
  data: PessoaSearch[];
  colorScheme?: `#${string}`[];
}

export const EscolaridadeRealation: React.FC<EscolaridadeRealationProps> = ({ data, colorScheme = colorScheme4 }) => {
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

  const escolaridadeConfig: ApexOptions = {
    legend: {
      formatter: (_value, opts) => escolaridadeValues[opts.seriesIndex].escolaridadeName,
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
            return escolaridadeValues[opts.seriesIndex].escolaridadeName;
          },
        } as any, // aaaaaaaa typescript errado da lib!!!!!!!
      },
    },
  };

  return (
    <Chart options={escolaridadeConfig} series={escolaridadeValues.map((v) => v.total)} type="donut" width="600" />
  );
};
