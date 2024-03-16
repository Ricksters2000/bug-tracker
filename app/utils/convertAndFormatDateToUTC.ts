import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

export const convertAndFormatDateToUTC = (date: Date) => {
  return dayjs(date).utc().format()
}