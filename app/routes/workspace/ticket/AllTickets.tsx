import React from "react"
import {LoaderFunction, json} from "@remix-run/node"
import {useLoaderData} from "@remix-run/react"
import {Breadcrumbs} from "~/components/Breadcrumbs"
import {TicketPreview, findTicketPreviews, serializedTicketToTicketPreview} from "~/server/db/ticketDb"
import {H1} from "~/typography"
import {TicketFilter} from "../components/TicketFilter"

export const loader: LoaderFunction = async () => {
  const tickets = await findTicketPreviews()
  return json(tickets)
}

export default function Index() {
  const tickets = useLoaderData<Array<TicketPreview>>().map(serializedTicketToTicketPreview)
  console.log(`tickets:`, tickets)
  return (
    <div>
      <H1>Tickets</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <TicketFilter tickets={tickets}/>
    </div>
  )
}