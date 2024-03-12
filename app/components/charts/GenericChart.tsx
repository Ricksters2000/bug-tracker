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
      {/* For some reason a fix to allow chart js charts to resize is to add this element https://github.com/chartjs/Chart.js/issues/11005#issuecomment-1433478026 */}
      <div>&nbsp;</div>
      <Chart width={`100%`} height={375} {...props}/>
    </Root>
  )
}

const Root = emotionStyled.div({
})