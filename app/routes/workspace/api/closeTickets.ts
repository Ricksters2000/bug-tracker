import {ActionFunction, json} from "@remix-run/node";
import {db} from "~/server/db/db";
import {createTicketUpdateInputAndSaveHistoryFromUpdateAction} from "../ticket/ticketDetails/updateTicketAction";

export type CloseTicketAction = {
  userId: number;
  ticketIds: Array<string>;
}

export const action: ActionFunction = async ({request}) => {
  const data = await request.json() as CloseTicketAction
  try {
    await db.$transaction(async tsx => {
      for (const ticketId of data.ticketIds) {
        const ticketUpdateInput = createTicketUpdateInputAndSaveHistoryFromUpdateAction({
          userId: data.userId,
          ticketId,
          action: {
            type: `isClosed`,
            data: true,
          },
          previousValue: null,
        })
        await tsx.ticket.update({
          data: ticketUpdateInput,
          where: {id: ticketId},
        })
      }
    })
    return json(`success`)
  } catch (e) {
    throw new Error(`Failed to close tickets: ${data.ticketIds}`)
  }
}