import {Priority, Prisma, Ticket} from "@prisma/client";
import {db} from "./db";
import {CommentPublic, commentSelectInput, serializedCommentToCommentPublic} from "./commentDb";
import {SerializeFrom} from "@remix-run/node";
import {TicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide";
import {allFilter} from "~/types/FilterWithAllOption";
import {UpdateTicketAction, FullUpdateTicketAction, convertUpdateTicketActionToUpdateInput, TicketPreviousValue, UpdateTicketActionAndSaveToHistory, createTicketUpdateInputAndSaveHistoryFromUpdateAction} from "~/routes/workspace/ticket/ticketDetails/updateTicketAction";
import {JSONR} from "~/utils/JSONR";

export type TicketHistory = {
  userId: number;
  date: Date;
  action: UpdateTicketActionAndSaveToHistory;
  previousValue: TicketPreviousValue;
}

export type TicketInfo = Omit<Ticket, `history`> & {
  comments: Array<CommentPublic>;
  history: Array<TicketHistory>;
}

export type TicketPreview = Pick<Ticket, `id` | `projectId` | `title` | `priority` | `status` | `dueDate` | `createdDate`>

export const ticketPreviewSelectInput = Prisma.validator<Prisma.TicketSelect>()({
  id: true,
  projectId: true,
  title: true,
  priority: true,
  status: true,
  dueDate: true,
  createdDate: true,
})

export const ticketInfoSelectInput = Prisma.validator<Prisma.TicketSelect>()({
  id: true,
  title: true,
  projectId: true,
  priority: true,
  dueDate: true,
  content: true,
  createdDate: true,
  history: true,
  status: true,
  comments: {
    select: commentSelectInput,
    orderBy: {dateSent: `asc`}
  }
})

export const findTicketById = async (id: string): Promise<TicketInfo | null> => {
  const ticket = await db.ticket.findUnique({
    select: ticketInfoSelectInput,
    where: {
      id,
    }
  })
  if (!ticket) return null;
  return {
    ...ticket,
    history: JSONR.parseFromString<Array<TicketHistory>>(JSONR.stringifyUntyped(ticket.history)),
  }
}

export const updateAndGetTicket = async (updateAction: FullUpdateTicketAction): Promise<TicketInfo | null> => {
  const {ticketId} = updateAction
  const ticketUpdateInput = createTicketUpdateInputAndSaveHistoryFromUpdateAction(updateAction)
  const newTicket = await db.ticket.update({
    select: ticketInfoSelectInput,
    where: {
      id: ticketId,
    },
    data: ticketUpdateInput,
  })
  return {
    ...newTicket,
    history: JSONR.parseFromString<Array<TicketHistory>>(JSONR.stringifyUntyped(newTicket.history)),
  }
}

export const findAllTicketPreviews = async (): Promise<Array<TicketPreview>> => {
  const tickets = await db.ticket.findMany({
    select: ticketPreviewSelectInput,
  })
  return tickets
}

export const findTicketPreviews = async (filter: Prisma.TicketWhereInput): Promise<Array<TicketPreview>> => {
  const tickets = await db.ticket.findMany({
    select: ticketPreviewSelectInput,
    where: filter,
  })
  return tickets
}

export const getTicketCounts = async (filter: Prisma.TicketWhereInput) => {
  const countsData = await db.ticket.groupBy({
    by: `priority`,
    _count: true,
    where: {
      ...filter,
      priority: undefined,
    },
  })
  const priorityCounts: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
  }
  countsData.forEach(count => {
    priorityCounts[count.priority] = count._count
  })
  return priorityCounts
}

export const serializedTicketToTicketPreview = (jsonTicket: SerializeFrom<TicketPreview>): TicketPreview => {
  return {
    id: jsonTicket.id,
    projectId: jsonTicket.projectId,
    title: jsonTicket.title,
    createdDate: new Date(jsonTicket.createdDate),
    dueDate: jsonTicket.dueDate ? new Date(jsonTicket.dueDate) : null,
    priority: jsonTicket.priority,
    status: jsonTicket.status,
  }
}

export const serializedTicketToTicketInfo = (jsonTicket: SerializeFrom<TicketInfo>): TicketInfo => {
  return {
    ...serializedTicketToTicketPreview(jsonTicket),
    content: jsonTicket.content,
    comments: jsonTicket.comments.map(serializedCommentToCommentPublic),
    history: jsonTicket.history.map(historyItem => ({
      ...historyItem,
      date: new Date(historyItem.date)
    })),
  }
}

export const convertTicketFilterClientSideToTicketWhereInput = (filter: TicketFilterClientSide): Prisma.TicketWhereInput => {
  const {createdDateRange, dueDateRange} = filter
  return {
    title: filter.title ? {contains: filter.title} : undefined,
    status: filter.statuses.length === 0 ? undefined : {in: filter.statuses},
    projectId: filter.projectIds.includes(allFilter) ? undefined : {in: filter.projectIds},
    priority: filter.priority === allFilter ? undefined : filter.priority,
    createdDate: createdDateRange.from && createdDateRange.to ? {
      gte: createdDateRange.from,
      lte: createdDateRange.to,
    } : undefined,
    dueDate: dueDateRange.from && dueDateRange.to ? {
      gte: dueDateRange.from,
      lte: dueDateRange.to,
    } : undefined,
  }
}