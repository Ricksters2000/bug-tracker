import {Priority} from "@prisma/client";
import {ActionFunction, json} from "@remix-run/node"
import {TicketPreview, convertTicketFilterClientSideToTicketFilterServerSide, findTicketPreviews, getTicketCountsByField} from "~/server/db/ticketDb";
import {TicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide";

export type TicketFilterActionData = {
  tickets: Array<TicketPreview>;
  ticketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
}

export const action: ActionFunction = async ({request}) => {
  const filter = await request.json() as TicketFilterClientSide
  const ticketFilterInput = convertTicketFilterClientSideToTicketFilterServerSide(filter)
  const paginationOptions = filter.pagination
  const tickets = await findTicketPreviews(ticketFilterInput.filter, ticketFilterInput.orderBy, paginationOptions.limit, paginationOptions.offset)
  const ticketCounts = await getTicketCountsByField(`priority`, {
    ...ticketFilterInput.filter,
    priority: undefined,
  })
  const data: TicketFilterActionData = {
    tickets,
    ticketPriorityCounts: ticketCounts,
    ticketCount: ticketCounts.low + ticketCounts.medium + ticketCounts.high,
  }
  return json(data)
}