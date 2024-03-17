import React from 'react';
import {GenericChart} from './GenericChart';
import {ChartData, ChartOptions} from 'chart.js';
import {ChartDatasetsRaw} from './utils/convertDataToChartData';
import {objectKeysAndExcludeKey} from '~/utils/objectKeys';

type Props<T extends Record<string, number | string>, K extends keyof T> = {
  datasetsRaw: ChartDatasetsRaw<T, K>;
}

export const BarChart = <T extends Record<string, number>, K extends keyof T>(props: Props<T, K>) => {
  const [datasets, setDatasets] = React.useState<ChartData<`bar`, number[]>[`datasets`]>([])
  const [labels, setLabels] = React.useState<Array<string>>(props.datasetsRaw.labels)

  React.useEffect(() => {
    const datasetsRaw = props.datasetsRaw
    const keys = objectKeysAndExcludeKey(datasetsRaw, `labels`)
    const currentDatasets: ChartData<`bar`, number[]>[`datasets`] = keys.map(key => {
      const data = datasetsRaw[key]
      return {
        label: key.toString(),
        data: data,
      }
    })
    setDatasets(currentDatasets)
  }, [])
  const data: ChartData<`bar`, number[], string> = {
    datasets: datasets,
    labels: labels,
  }
  const options: ChartOptions<`bar`> = {
    indexAxis: `y`,
    maintainAspectRatio: false,
  }
  return (
    <GenericChart type='bar' data={data} options={options}/>
  )
}