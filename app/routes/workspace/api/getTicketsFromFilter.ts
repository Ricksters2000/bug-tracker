import {Priority} from "@prisma/client";
import {ActionFunction, json} from "@remix-run/node"
import {db} from "~/server/db/db";
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
  const totalTicketCount = await db.ticket.count({where: {
    ...ticketFilterInput.filter,
    priority: undefined,
  }})
  const ticketPriorityCounts: Record<Priority, number> = {
    [Priority.high]: ticketCounts.high ?? 0,
    [Priority.medium]: ticketCounts.medium ?? 0,
    [Priority.low]: ticketCounts.low ?? 0,
  }
  const data: TicketFilterActionData = {
    tickets,
    ticketPriorityCounts,
    ticketCount: totalTicketCount,
  }
  return json(data)
}