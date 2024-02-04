import {$Enums, Priority, Prisma, Ticket} from "@prisma/client";
import {db} from "./db";
import {CommentPublic, commentSelectInput} from "./commentDb";
import {SerializeFrom} from "@remix-run/node";
import {TicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide";

export type TicketInfo = Omit<Ticket, `projectId`> & {
  comments: Array<CommentPublic>;
}

export type TicketPreview = Pick<Ticket, `id` | `projectId` | `title` | `priority` | `dueDate` | `createdDate`>

export const ticketPreviewSelectInput = Prisma.validator<Prisma.TicketSelect>()({
  id: true,
  projectId: true,
  title: true,
  priority: true,
  dueDate: true,
  createdDate: true,
})

export const findTicketById = async (id: string): Promise<TicketInfo | null> => {
  const ticket = await db.ticket.findUnique({
    select: {
      id: true,
      title: true,
      priority: true,
      dueDate: true,
      content: true,
      createdDate: true,
      history: true,
      status: true,
      comments: {
        select: commentSelectInput,
        orderBy: {dateSent: `desc`}
      }
    },
    where: {
      id,
    }
  })
  return ticket
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
  }
}

export const convertTicketFilterClientSideToTicketWhereInput = (filter: TicketFilterClientSide): Prisma.TicketWhereInput => {
  const {createdDateRange, dueDateRange} = filter
  return {
    title: filter.title ? {contains: filter.title} : undefined,
    status: filter.statuses.length === 0 ? undefined : {in: filter.statuses},
    priority: filter.priority === `ALL` ? undefined : filter.priority,
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