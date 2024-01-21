import {LoaderFunction, json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {TicketInfo, findTicketById} from "~/server/db/ticketDb";

export const loader: LoaderFunction = async ({params}) => {
  const {ticketId} = params
  if (!ticketId) {
    return json(`Error`)
  }
  const ticket = await findTicketById(ticketId)
  if (!ticket) {
    return json(`Error`)
  }
  return ticket
}

export default function Ticket() {
  const ticket = useLoaderData<TicketInfo>()
  
}
