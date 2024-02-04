import React from "react"
import {ActionFunction, json} from "@remix-run/node"
import {useFetcher} from "@remix-run/react"
import {Breadcrumbs} from "~/components/Breadcrumbs"
import {TicketPreview, convertTicketFilterClientSideToTicketWhereInput, findTicketPreviews, getTicketCounts, serializedTicketToTicketPreview} from "~/server/db/ticketDb"
import {H1} from "~/typography"
import {TicketFilter} from "../components/TicketFilter"
import {TicketFilterClientSide, defaultTicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide"
import {Priority} from "@prisma/client"

type ActionData = {
  tickets: Array<TicketPreview>;
  ticketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
}

export const action: ActionFunction = async ({request}) => {
  const filter = await request.json() as TicketFilterClientSide
  const ticketWhereInput = convertTicketFilterClientSideToTicketWhereInput(filter)
  const tickets = await findTicketPreviews(ticketWhereInput)
  const ticketCounts = await getTicketCounts(ticketWhereInput)
  const data: ActionData = {
    tickets,
    ticketPriorityCounts: ticketCounts,
    ticketCount: ticketCounts.low + ticketCounts.medium + ticketCounts.high,
  }
  return json(data)
}

export default function Index() {
  const [ticketFilter, setTicketFilter] = React.useState<TicketFilterClientSide>({...defaultTicketFilterClientSide})  
  const fetcher = useFetcher<ActionData>()
  React.useEffect(() => {
    const stringifiedData = JSON.stringify(ticketFilter)
    fetcher.submit(stringifiedData, {
      method: `post`,
      encType: `application/json`,
    })
  }, [ticketFilter])

  if (!fetcher.data) return null
  const tickets = fetcher.data.tickets.map(serializedTicketToTicketPreview)
  return (
    <div>
      <H1>Tickets</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <TicketFilter
        tickets={tickets}
        ticketFilter={ticketFilter}
        onChange={setTicketFilter}
        priorityCounts={fetcher.data.ticketPriorityCounts}
        ticketCount={fetcher.data.ticketCount}/>
    </div>
  )
}