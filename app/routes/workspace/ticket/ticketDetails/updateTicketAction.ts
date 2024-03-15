import {Priority, Prisma, TicketStatus} from "@prisma/client";
import {TicketHistory} from "~/server/db/ticketDb";

export type FullUpdateTicketAction = {
  ticketId: string;
  userId: number;
  action: UpdateTicketAction;
  previousValue: TicketPreviousValue
}

export type TicketPreviousValue = UpdateTicketActionAndSaveToHistory[`data`] | null;

export type UpdateTicketAction = UpdateTicketActionAndSaveToHistory |
  UpdateAddCommentAction;

export type UpdateTicketActionAndSaveToHistory = 
  UpdateTitleAction |
  UpdateContentAction |
  UpdatePriorityAction |
  UpdateStatusAction |
  UpdateAssignUserAction |
  UpdateRemoveUserAction |
  UpdateIsClosedAction;

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

type UpdateStatusAction = {
  type: `status`;
  data: TicketStatus;
}

type UpdateAssignUserAction = {
  type: `assignUser`;
  data: number;
}

type UpdateRemoveUserAction = {
  type: `removeUser`;
  data: number;
}

type UpdateIsClosedAction = {
  type: `isClosed`;
  data: boolean;
}

type UpdateAddCommentAction = {
  type: `addComment`;
  data: {
    userId: number;
    message: string;
  };
}

export const createTicketUpdateInputAndSaveHistoryFromUpdateAction = (fullAction: FullUpdateTicketAction): Prisma.TicketUpdateInput => {
  const updateInput = convertUpdateTicketActionToUpdateInput(fullAction.action)
  // don't save history for adding comments
  if (fullAction.action.type !== `addComment`) {
    const history: TicketHistory = {
      userId: fullAction.userId,
      action: fullAction.action,
      previousValue: fullAction.previousValue,
      date: new Date(),
    }
    return {
      ...updateInput,
      history: {push: history},
    }
  }
  return updateInput
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
    case `status`:
      return {
        status: action.data
      }
    case `isClosed`:
      return {
        isClosed: action.data,
        ...(action.data ? {
          closedDate: new Date(),
        } : {}),
      }
    case `addComment`:
      return {
        comments: {
          create: {
            userId: action.data.userId,
            message: action.data.message,
            dateSent: new Date(),
          }
        }
      }
    case `assignUser`:
      return {
        assignedUsers: {
          connect: {id: action.data},
        },
      }
    case `removeUser`:
      return {
        assignedUsers: {
          disconnect: {id: action.data},
        },
      }
    default:
      return {}
  }
}