import {$Enums, Prisma, Ticket} from "@prisma/client";
import {db} from "./db";
import {CommentPublic, commentSelectInput} from "./commentDb";

export type TicketInfo = Omit<Ticket, `projectId`> & {
  comments: Array<CommentPublic>;
}

export type TicketPreview = Pick<Ticket, `id` | `title` | `priority` | `dueDate` | `createdDate`>

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
    select: {
      id: true,
      title: true,
      priority: true,
      dueDate: true,
      createdDate: true,
    }
  })
  return tickets
}