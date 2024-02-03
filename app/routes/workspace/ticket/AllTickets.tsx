import React from "react"
import {ActionFunction, json} from "@remix-run/node"
import {useFetcher} from "@remix-run/react"
import {Breadcrumbs} from "~/components/Breadcrumbs"
import {TicketPreview, convertTicketFilterClientSideToTicketWhereInput, findTicketPreviews, serializedTicketToTicketPreview} from "~/server/db/ticketDb"
import {H1} from "~/typography"
import {TicketFilter} from "../components/TicketFilter"
import {TicketFilterClientSide, defaultTicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide"

export const action: ActionFunction = async ({request}) => {
  const filter = await request.json() as TicketFilterClientSide
  const ticketWhereInput = convertTicketFilterClientSideToTicketWhereInput(filter)
  const tickets = await findTicketPreviews(ticketWhereInput)
  return json(tickets)
}

export default function Index() {
  const [ticketFilter, setTicketFilter] = React.useState<TicketFilterClientSide>({...defaultTicketFilterClientSide})  
  const fetcher = useFetcher<Array<TicketPreview>>()
  let tickets: Array<TicketPreview> = []
  React.useEffect(() => {
    const stringifiedData = JSON.stringify(ticketFilter)
    fetcher.submit(stringifiedData, {
      method: `post`,
      encType: `application/json`,
    })
  }, [ticketFilter])

  if (fetcher.data) {
    tickets = fetcher.data.map(serializedTicketToTicketPreview)
  }
  return (
    <div>
      <H1>Tickets</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <TicketFilter tickets={tickets}/>
    </div>
  )
}