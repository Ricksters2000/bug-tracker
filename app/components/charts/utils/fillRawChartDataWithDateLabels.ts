import dayjs from "dayjs";
import {ChartDataRaw} from "./convertDataToChartData";

/** Expects chartData to be sorted by date ascending */
export const fillRawChartDataWithDateLabels = (chartData: Array<ChartDataRaw>, from: Date, to: Date) => {
  let currentIndex = 0
  const startingDate = dayjs(from)
  const amountOfDays = startingDate.diff(to, `day`) * -1
  const newChartData: Array<ChartDataRaw> = new Array(amountOfDays).fill(0).map((_, i) => {
    const currentDate = startingDate.add(i, `day`)
    const formattedDate = currentDate.format(`MM/DD`)
    if (currentIndex >= chartData.length) {
      return {
        label: formattedDate,
        value: 0,
      }
    }
    const currentChartData = chartData[currentIndex]
    if (currentDate.isSame(currentChartData.label, `day`)) {
      currentIndex++
      return {
        label: formattedDate,
        value: currentChartData.value,
      }
    }
    return {
      label: formattedDate,
      value: 0,
    }
  })
  return newChartData
}