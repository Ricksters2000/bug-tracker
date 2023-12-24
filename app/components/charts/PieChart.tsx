import {ChartData} from 'chart.js';
import React from 'react';
import {GenericChart} from './GenericChart';

type Props = {

}

export const PieChart: React.FC<Props> = (props) => {
  const data: ChartData<`bar`, number[], string> = {
    datasets: [
      {
        label: `Tickets`,
        data: [55, 32, 12],
      }
    ],
    labels: [`High`, `Medium`, `Low`],
  }

  return (
    <GenericChart type='doughnut' data={data}/>
  )
}