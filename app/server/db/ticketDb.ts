import {$Enums, Prisma, Ticket} from "@prisma/client";
import {db} from "./db";
import {CommentPublic, commentSelectInput} from "./commentDb";
import {SerializeFrom} from "@remix-run/node";

export type TicketInfo = Omit<Ticket, `projectId`> & {
  comments: Array<CommentPublic>;
}

export type TicketPreview = Pick<Ticket, `id` | `title` | `priority` | `dueDate` | `createdDate`>

export const ticketPreviewSelectInput = Prisma.validator<Prisma.TicketSelect>()({
  id: true,
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

export const findTicketPreviews = async (): Promise<Array<TicketPreview>> => {
  const tickets = await db.ticket.findMany({
    select: ticketPreviewSelectInput,
  })
  return tickets
}

export const serializedTicketToTicketPreview = (jsonTicket: SerializeFrom<TicketPreview>): TicketPreview => {
  return {
    id: jsonTicket.id,
    title: jsonTicket.title,
    createdDate: new Date(jsonTicket.createdDate),
    dueDate: jsonTicket.dueDate ? new Date(jsonTicket.dueDate) : null,
    priority: jsonTicket.priority,
  }
}