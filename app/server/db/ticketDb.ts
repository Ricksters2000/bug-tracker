import {$Enums} from "@prisma/client";
import {db} from "./db";

export type TicketPreview = {
  id: number;
  title: string;
  priority: $Enums.Priority;
  dueDate: Date | null;
  createdDate: Date;
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