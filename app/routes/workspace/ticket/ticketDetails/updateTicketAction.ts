import {Priority, Prisma} from "@prisma/client";
import {TicketHistory} from "~/server/db/ticketDb";

export type FullUpdateTicketAction = {
  ticketId: string;
  userId: number;
  action: UpdateTicketAction;
  previousValue: TicketPreviousValue
}

export type TicketPreviousValue = UpdateTicketAction[`data`] | null;

export type UpdateTicketAction = 
  UpdateTitleAction |
  UpdateContentAction |
  UpdatePriorityAction;

type UpdateTitleAction = {
  type: `title`;
  data: string;
}

type UpdateContentAction = {
  type: `content`;
  data: string;
}

type UpdatePriorityAction = {
  type: `priority`;
  data: Priority;
}

export const convertUpdateTicketActionToUpdateInput = (action: UpdateTicketAction): Prisma.TicketUpdateInput => {
  switch (action.type) {
    case `title`:
      return {
        title: action.data
      }
    case `content`:
      return {
        content: action.data
      }
    case `priority`:
      return {
        priority: action.data
      }
  }
}