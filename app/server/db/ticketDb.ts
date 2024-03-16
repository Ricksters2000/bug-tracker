import {Prisma, Ticket} from "@prisma/client";
import {db} from "./db";
import {CommentPublic, commentSelectInput, serializedCommentToCommentPublic} from "./commentDb";
import {SerializeFrom} from "@remix-run/node";
import {TicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide";
import {allFilter} from "~/types/FilterWithAllOption";
import {FullUpdateTicketAction, TicketPreviousValue, UpdateTicketActionAndSaveToHistory, createTicketUpdateInputAndSaveHistoryFromUpdateAction} from "~/routes/workspace/ticket/ticketDetails/updateTicketAction";
import {JSONR} from "~/utils/JSONR";
import {UserPublic, userPublicSelectInput} from "./userDb";
import {GroupByDate} from "./types";
import {DateRange} from "~/types/DateRange";
import {convertAndFormatDateToUTC} from "~/utils/convertAndFormatDateToUTC";

export type TicketHistory = {
  userId: number;
  date: Date;
  action: UpdateTicketActionAndSaveToHistory;
  previousValue: TicketPreviousValue;
}

export type TicketInfo = Omit<Ticket, `history` | `companyId` | `closedDate`> & {
  comments: Array<CommentPublic>;
  history: Array<TicketHistory>;
  assignedUsers: Array<UserPublic>;
}

export type TicketPreview = Pick<Ticket, `id` | `projectId` | `title` | `priority` | `status` | `dueDate` | `createdDate` | `isClosed`>

type TicketGroupByKeys = Omit<Ticket, `createdDate` | `dueDate` | `history` | `content` | `isClosed` | `closedDate`>
type GroupByDateKeys = keyof Pick<Ticket, `closedDate` | `createdDate` | `dueDate`>

export const ticketPreviewSelectInput = Prisma.validator<Prisma.TicketSelect>()({
  id: true,
  projectId: true,
  title: true,
  priority: true,
  status: true,
  dueDate: true,
  createdDate: true,
  isClosed: true,
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
  isClosed: true,
  comments: {
    select: commentSelectInput,
    orderBy: {dateSent: `asc`}
  },
  assignedUsers: {
    select: userPublicSelectInput,
  },
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

export const findTicketPreviews = async (filter: Prisma.TicketWhereInput, orderBy?: Prisma.TicketOrderByWithRelationInput, limit?: number, offset?: number): Promise<Array<TicketPreview>> => {
  const tickets = await db.ticket.findMany({
    select: ticketPreviewSelectInput,
    where: filter,
    orderBy,
    skip: offset,
    take: limit,
  })
  return tickets
}

export const getTicketCountsByField = async <T extends keyof TicketGroupByKeys>(field: T, filter: Prisma.TicketWhereInput): Promise<Record<TicketGroupByKeys[T], number>> => {
  const countsData = await db.ticket.groupBy({
    by: field,
    _count: true,
    where: {
      ...filter,
    },
  })
  if (!Array.isArray(countsData)) throw new Error(`Unexpected failed to retrieve group by counts data from ticket field: ${field}`)
  const counts = {} as Record<TicketGroupByKeys[T], number>;
  countsData.forEach((count: Record<string, TicketGroupByKeys[T]> & {_count: number}) => {
    const key = count[field] as TicketGroupByKeys[T]
    counts[key] = count._count
  })
  return counts
}

export const getTicketCountsByDateField = async (field: GroupByDateKeys, projectId: string, dateRange: DateRange, isClosed?: boolean): Promise<Array<GroupByDate>> => {
  const {from, to} = dateRange
  if (!from || !to) {
    throw new Error(`Date range must have both from and to properties set when retrieving ticket counts data by date field`)
  }
  const dateField = `DATE("${field}")`
  const countsData = await db.$queryRawUnsafe<Array<GroupByDate>>(`
    SELECT ${dateField} as "date", count(*)
    FROM public."Ticket"
    WHERE ${dateField} BETWEEN DATE('${convertAndFormatDateToUTC(from)}') AND DATE('${convertAndFormatDateToUTC(to)}')
    AND "projectId"='${projectId}'
    ${
      isClosed === undefined ? `` :
      `AND "isClosed"=${isClosed}`
    }
    GROUP BY "date"
    ORDER BY "date" ASC;
  `)
  return countsData.map(countData => ({
    date: countData.date,
    count: parseInt(countData.count.toString()),
  }))
}

export const serializedTicketToTicketPreview = (jsonTicket: SerializeFrom<TicketPreview>): TicketPreview => {
  return {
    ...jsonTicket,
    createdDate: new Date(jsonTicket.createdDate),
    dueDate: jsonTicket.dueDate ? new Date(jsonTicket.dueDate) : null,
  }
}

export const serializedTicketToTicketInfo = (jsonTicket: SerializeFrom<TicketInfo>): TicketInfo => {
  return {
    ...serializedTicketToTicketPreview(jsonTicket),
    content: jsonTicket.content,
    assignedUsers: jsonTicket.assignedUsers,
    comments: jsonTicket.comments.map(serializedCommentToCommentPublic),
    history: jsonTicket.history.map(historyItem => ({
      ...historyItem,
      date: new Date(historyItem.date)
    })),
  }
}

export const convertTicketFilterClientSideToTicketFilterServerSide = (filter: TicketFilterClientSide) => {
  const {createdDateRange, dueDateRange, orderBy} = filter
  const ticketFilter: Prisma.TicketWhereInput = {
    companyId: filter.companyId,
    title: filter.title ? {contains: filter.title} : undefined,
    status: filter.statuses.length === 0 ? undefined : {in: filter.statuses},
    projectId: filter.projectIds.includes(allFilter) ? undefined : {in: filter.projectIds},
    priority: filter.priority === allFilter ? undefined : filter.priority,
    isClosed: filter.isClosed,
    createdDate: createdDateRange.from && createdDateRange.to ? {
      gte: createdDateRange.from,
      lte: createdDateRange.to,
    } : undefined,
    dueDate: dueDateRange.from && dueDateRange.to ? {
      gte: dueDateRange.from,
      lte: dueDateRange.to,
    } : undefined,
  }
  const ticketOrderBy: Prisma.TicketOrderByWithRelationInput = {
    [orderBy.field]: orderBy.order,
  }
  return {
    filter: ticketFilter,
    orderBy: ticketOrderBy,
  }
}