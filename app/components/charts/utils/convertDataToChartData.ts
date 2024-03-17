import {objectKeys, objectKeysAndExcludeKey} from "~/utils/objectKeys";

export type ChartDataRaw = Array<{
  value: number;
  label: string;
  color?: string;
}>

export type ChartDatasetsRaw<T extends object, Key extends keyof T> = {
  [x in keyof Omit<T, Key>]: Array<number> | Array<string>;
} & {
  labels: Array<string>
};

export const convertDataToChartData = (data: ChartDataRaw) => {
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

export const convertGenericDataToChartDatasets = <T extends Record<string, string | number>, K extends keyof T>(data: Array<T>, labelField: K): ChartDatasetsRaw<T, K> => {
  // @ts-ignore
  const chartData: ChartDatasetsRaw<T, K> = {
    labels: [],
  }
  data.forEach(dataObject => {
    const label = dataObject[labelField]
    const keys = objectKeysAndExcludeKey(dataObject, labelField)
    chartData.labels.push(label.toString())
    keys.forEach(key => {
      const currentData = chartData[key] as Array<number>
      const value = dataObject[key]
      if (typeof value !== `number`) {
        return
      }
      if (!currentData) {
        // @ts-ignore
        chartData[key] = [value]
      } else {
        currentData.push(value)
      }
    })
  })
  return chartData
}