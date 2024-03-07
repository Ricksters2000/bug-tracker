import 'chart.js/auto';
import {ChartTypeRegistry} from 'chart.js';
import React from 'react';
import {Chart, ChartProps} from 'react-chartjs-2';
import emotionStyled from '@emotion/styled';


export const GenericChart = <T extends keyof ChartTypeRegistry>(props: ChartProps<T>) => {
  // const chartRef = React.useRef<ChartJSOrUndefined<`doughnut`, number[]>>(null);
  // const chartId = React.useRef<string | null>(null);

  // React.useEffect(() => {
  //   if (chartId.current !== null || !chartRef.current) return;
  //   const data: ChartData<`doughnut`, number[], string> = {
  //     datasets: [
  //       {
  //         label: `Tickets`,
  //         data: [55, 32, 12],
  //       }
  //     ],
  //     labels: [`High`, `Medium`, `Low`]
  //   }
  //   const chart = new Chart(chartRef.current, {type: `doughnut`, data})
  //   chartId.current = chart.id
  // })

  return (
    <Root>
      <div>&nbsp;</div>
      <Chart width={`100%`} height={375} {...props}/>
    </Root>
  )
}

const Root = emotionStyled.div({
})