import React from 'react';
import {ChartDataRaw, convertDataToChartData} from './utils/convertDataToChartData';
import {GenericChart} from './GenericChart';
import {ChartData} from 'chart.js';

type Props = {
  data: ChartDataRaw;
  label: string;
  backgroundColor?: string;
}

export const LineChart: React.FC<Props> = (props) => {
  const [dataValues, setDataValues] = React.useState<Array<number>>([])
  const [labels, setLabels] = React.useState<Array<string>>([])

  React.useEffect(() => {
    const {currentLabeles, values} = convertDataToChartData(props.data)
    setDataValues(values)
    setLabels(currentLabeles)
  }, [])

  const data: ChartData<`line`, number[], string> = {
    datasets: [
      {
        label: props.label,
        data: dataValues,
        backgroundColor: props.backgroundColor,
      }
    ],
    labels: labels,
  }
  return (
    <GenericChart type='line' data={data} options={{maintainAspectRatio: false}}/>
  )
}