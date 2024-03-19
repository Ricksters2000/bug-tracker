import dayjs from "dayjs"

const daysToNearDueDate = 14

export const getEndOfNearDueDate = () => {
  const endOfDueDate = dayjs().add(daysToNearDueDate, `day`)
  return endOfDueDate.toDate()
}

export const isNearDueDate = (dueDate: Date) => {
  const currentDate = dayjs()
  const difference = currentDate.diff(dueDate, `day`) * -1
  if (difference <= daysToNearDueDate) {
    return true
  }
  return false
}

export const isPastDueDate = (dueDate: Date) => {
  const currentDate = dayjs()
  const difference = currentDate.diff(dueDate)
  if (difference > 0) {
    return true
  }
  return false
}