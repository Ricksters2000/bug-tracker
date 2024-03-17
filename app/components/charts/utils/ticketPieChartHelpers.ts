import {Priority, TicketStatus} from "@prisma/client";
import {ChartDataRaw} from "./convertDataToChartData";
import {statusLightColors} from "~/routes/workspace/utils/statusColors";

export const convertTicketPriorityCountsToChartDataRaw = (ticketCounts: Record<Priority, number>): ChartDataRaw => {
  return [
    {value: ticketCounts.high, label: `High`, color: `rgb(255, 99, 132)`},
    {value: ticketCounts.medium, label: `Medium`, color: `rgb(255, 205, 86)`},
    {value: ticketCounts.low, label: `Low`, color: `rgb(54, 162, 235)`},
  ]
}

export const convertTicketStatusCountsToChartDataRaw = (ticketCounts: Record<TicketStatus, number>): ChartDataRaw => {
  return [
    {value: ticketCounts.new, label: `New`, color: statusLightColors.new},
    {value: ticketCounts.development, label: `Development`, color: statusLightColors.development},
    {value: ticketCounts.testing, label: `Testing`, color: statusLightColors.testing},
    {value: ticketCounts.reviewed, label: `Reviewed`, color: statusLightColors.reviewed},
  ]
}