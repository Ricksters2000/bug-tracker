import React from 'react';
import {GenericChart} from './GenericChart';
import {ChartData, ChartOptions} from 'chart.js';

export type BarChartDataset = {
  labels: Array<string>;
  datasets: Array<{
    label: string;
    values: Array<number>;
  }>;
}

type Props = {
  datasets: BarChartDataset;
}

export const BarChart: React.FC<Props> = (props) => {
  const [datasets, setDatasets] = React.useState<ChartData<`bar`, number[]>[`datasets`]>([])

  React.useEffect(() => {
    const datasetsRaw = props.datasets
    const currentDatasets: ChartData<`bar`, number[]>[`datasets`] = datasetsRaw.datasets.map(data => {
      return {
        label: data.label,
        data: data.values,
      }
    })
    setDatasets(currentDatasets)
  }, [])

  const data: ChartData<`bar`, number[], string> = {
    datasets: datasets,
    labels: props.datasets.labels,
  }
  const options: ChartOptions<`bar`> = {
    indexAxis: `y`,
    maintainAspectRatio: false,
  }
  return (
    <GenericChart type='bar' height={450} data={data} options={options}/>
  )
}