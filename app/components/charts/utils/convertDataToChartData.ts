export type ChartDataRaw = {
  value: number;
  label: string;
  color?: string;
}

export const convertDataToChartData = (data: Array<ChartDataRaw>) => {
  const values: Array<number> = []
  const currentLabeles: Array<string> = []
  const labelColors: Array<string> = []
  data.forEach(data => {
    values.push(data.value)
    currentLabeles.push(data.label)
    if (data.color) {
      labelColors.push(data.color)
    }
  })
  return {
    values,
    currentLabeles,
    labelColors,
  }
}