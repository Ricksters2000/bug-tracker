import {ChartData, ChartOptions, Plugin} from 'chart.js';
import React from 'react';
import {GenericChart} from './GenericChart';
import {ChartDataRaw, convertDataToChartData} from './utils/convertDataToChartData';

type Props = {
  label: string;
  data: ChartDataRaw;
  centerNumber?: number;
}

export const PieChart: React.FC<Props> = (props) => {
  const [dataValues, setDataValues] = React.useState<Array<number>>([])
  const [labels, setLabels] = React.useState<Array<string>>([])
  const [colors, setColors] = React.useState<Array<string>>([])

  React.useEffect(() => {
    const {labelColors, currentLabeles, values} = convertDataToChartData(props.data)
    setDataValues(values)
    setLabels(currentLabeles)
    setColors(labelColors)
  }, [])

  const data: ChartData<`doughnut`, number[], string> = {
    datasets: [
      {
        label: props.label,
        data: dataValues,
        backgroundColor: colors
      }
    ],
    labels: labels,
  }
  const options: ChartOptions<`doughnut`> = {
    cutout: `90%`
  }
  const displayCenteredNumberPlugin: Plugin<`doughnut`> = {
    id: `displayCenterNumber`,
    beforeDraw: (chart) => {
      const ctx = chart.ctx
      const {top, left, width, height} = chart.chartArea;
      const x = left + width / 2;
      const y = top + height / 2;
      const fontSize = Math.min(90, width / 5)
      ctx.textAlign = `center`
      ctx.font = `bold ${fontSize}px Metropolis,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji`
      ctx.fillStyle = `black`
      ctx.fillText(`${props.centerNumber}`, x, y)
      ctx.font = `bold 18px Metropolis,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji`
      ctx.fillStyle = `gray`
      ctx.fillText(`Total:`, x, y - (fontSize / 2 + 10))
    }
  }

  return (
    <GenericChart type='doughnut' plugins={[displayCenteredNumberPlugin]} options={options} data={data}/>
  )
}